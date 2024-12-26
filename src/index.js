#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import axios from 'axios';
import { Moon } from "lunarphase-js";
// Constants
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const ZODIAC_SIGNS = [
  { sign: 'Capricorn', start: '01-01', end: '01-19', element: 'Earth', planet: 'Saturn', traits: ['Ambitious', 'Practical', 'Disciplined'] },
  { sign: 'Aquarius', start: '01-20', end: '02-18', element: 'Air', planet: 'Uranus', traits: ['Progressive', 'Original', 'Independent'] },
  { sign: 'Pisces', start: '02-19', end: '03-20', element: 'Water', planet: 'Neptune', traits: ['Compassionate', 'Artistic', 'Intuitive'] },
  { sign: 'Aries', start: '03-21', end: '04-19', element: 'Fire', planet: 'Mars', traits: ['Courageous', 'Energetic', 'Spontaneous'] },
  { sign: 'Taurus', start: '04-20', end: '05-20', element: 'Earth', planet: 'Venus', traits: ['Patient', 'Reliable', 'Determined'] },
  { sign: 'Gemini', start: '05-21', end: '06-20', element: 'Air', planet: 'Mercury', traits: ['Adaptable', 'Curious', 'Expressive'] },
  { sign: 'Cancer', start: '06-21', end: '07-22', element: 'Water', planet: 'Moon', traits: ['Nurturing', 'Protective', 'Intuitive'] },
  { sign: 'Leo', start: '07-23', end: '08-22', element: 'Fire', planet: 'Sun', traits: ['Creative', 'Generous', 'Confident'] },
  { sign: 'Virgo', start: '08-23', end: '09-22', element: 'Earth', planet: 'Mercury', traits: ['Analytical', 'Practical', 'Diligent'] },
  { sign: 'Libra', start: '09-23', end: '10-22', element: 'Air', planet: 'Venus', traits: ['Diplomatic', 'Fair', 'Social'] },
  { sign: 'Scorpio', start: '10-23', end: '11-21', element: 'Water', planet: 'Pluto', traits: ['Passionate', 'Resourceful', 'Brave'] },
  { sign: 'Sagittarius', start: '11-22', end: '12-21', element: 'Fire', planet: 'Jupiter', traits: ['Optimistic', 'Adventurous', 'Honest'] },
  { sign: 'Capricorn', start: '12-22', end: '12-31', element: 'Earth', planet: 'Saturn', traits: ['Ambitious', 'Practical', 'Disciplined'] },
];

const CHINESE_ZODIAC = [
  { animal: 'Monkey', element: 'Metal', traits: ['Clever', 'Innovative', 'Active'] },
  { animal: 'Rooster', element: 'Metal', traits: ['Honest', 'Punctual', 'Confident'] },
  { animal: 'Dog', element: 'Earth', traits: ['Loyal', 'Honest', 'Kind'] },
  { animal: 'Pig', element: 'Water', traits: ['Diligent', 'Compassionate', 'Generous'] },
  { animal: 'Rat', element: 'Water', traits: ['Quick-witted', 'Resourceful', 'Versatile'] },
  { animal: 'Ox', element: 'Earth', traits: ['Honest', 'Diligent', 'Patient'] },
  { animal: 'Tiger', element: 'Wood', traits: ['Brave', 'Confident', 'Charismatic'] },
  { animal: 'Rabbit', element: 'Wood', traits: ['Gentle', 'Elegant', 'Alert'] },
  { animal: 'Dragon', element: 'Wood', traits: ['Confident', 'Intelligent', 'Enthusiastic'] },
  { animal: 'Snake', element: 'Fire', traits: ['Enigmatic', 'Intelligent', 'Wise'] },
  { animal: 'Horse', element: 'Fire', traits: ['Energetic', 'Independent', 'Adventurous'] },
  { animal: 'Goat', element: 'Earth', traits: ['Gentle', 'Wise', 'Artistic'] }
];

const BIRTHSTONES = [
  'Garnet', 'Amethyst', 'Aquamarine', 'Diamond', 'Emerald', 'Pearl',
  'Ruby', 'Peridot', 'Sapphire', 'Opal', 'Topaz', 'Turquoise'
];

const BIRTH_FLOWERS = [
  'Carnation', 'Violet', 'Daffodil', 'Daisy', 'Lily of the Valley', 'Rose',
  'Larkspur', 'Gladiolus', 'Aster', 'Marigold', 'Chrysanthemum', 'Narcissus'
];

// Helper Functions
function getZodiacSign(day, month) {
  const dateStr = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return ZODIAC_SIGNS.find(z => dateStr >= z.start && dateStr <= z.end);
}

function getChineseZodiac(year) {
  return CHINESE_ZODIAC[year % 12];
}

function calculateLifePathNumber(day, month, year) {
  const dateSum = String(day + month + year).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  let lifePathNum = dateSum;
  while (lifePathNum > 9) {
    lifePathNum = String(lifePathNum).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return lifePathNum;
}

function calculateAge(birthDate) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function getNextBirthday(birthDate) {
  const today = new Date();
  const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  const daysUntil = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
  return { date: nextBirthday, daysUntil };
}

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getMoonPhase(date) {
  const phase = Moon.lunarPhase(date);  
  return phase;
}

async function getHistoricalEvents(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const response = await axios.get(`https://history.muffinlabs.com/date/${month}/${day}`);
  return response.data.data.Events;
}

// Validate Date Format (dd/mm/yyyy)
function isValidDate(dateStr) {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateStr)) return false;

  const [day, month, year] = dateStr.split('/').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

// Display Results
async function displayResults(date, birthDate) {
  const dayOfWeek = DAYS[birthDate.getDay()];
  const zodiacSign = getZodiacSign(birthDate.getDate(), birthDate.getMonth() + 1);
  const chineseZodiac = getChineseZodiac(birthDate.getFullYear());
  const age = calculateAge(birthDate);
  const lifePathNum = calculateLifePathNumber(birthDate.getDate(), birthDate.getMonth() + 1, birthDate.getFullYear());
  const nextBirthday = getNextBirthday(birthDate);
  const dayOfYear = getDayOfYear(birthDate);
  const moonPhase = getMoonPhase(birthDate);
  const historicalEvents = await getHistoricalEvents(birthDate);
  const birthstone = BIRTHSTONES[birthDate.getMonth()];
  const birthFlower = BIRTH_FLOWERS[birthDate.getMonth()];

  console.log(chalk.bold.blue('\n🎂 Birthday Insights 🎂'));
  console.log('━'.repeat(50));

  // Basic Information
  console.log(chalk.green('📅 Date of Birth: '), chalk.yellow(date));
  console.log(chalk.green('📆 Day of the Week: '), chalk.yellow(dayOfWeek));
  console.log(chalk.green('🎈 Age: '), chalk.yellow(age));
  console.log(chalk.green('🌍 Day of the Year: '), chalk.yellow(dayOfYear));

  // Next Birthday
  console.log(chalk.green('🎉 Days until next birthday: '), chalk.yellow(nextBirthday.daysUntil));

  // Zodiac Information
  console.log('\n' + chalk.bold.magenta('✨ Astrological Profile ✨'));
  console.log(chalk.green('⭐ Western Zodiac: '), chalk.yellow(`${zodiacSign.sign} (${zodiacSign.element}, ruled by ${zodiacSign.planet})`));
  console.log(chalk.green('🔮 Zodiac Traits: '), chalk.yellow(zodiacSign.traits.join(', ')));

  // Chinese Zodiac
  console.log(chalk.green('🏮 Chinese Zodiac: '), chalk.yellow(`${chineseZodiac.animal} (${chineseZodiac.element})`));
  console.log(chalk.green('🎋 Chinese Zodiac Traits: '), chalk.yellow(chineseZodiac.traits.join(', ')));

  // Numerology
  console.log('\n' + chalk.bold.cyan('🔢 Numerology'));
  console.log(chalk.green('Life Path Number: '), chalk.yellow(lifePathNum));

  // Moon Phase
  console.log('\n' + chalk.bold.yellow('🌙 Moon Phase'));
  console.log(chalk.green('Phase: '), chalk.yellow(moonPhase));

  // Birthstone and Birth Flower
  console.log('\n' + chalk.bold.green('💎 Birthstone & 🌸 Birth Flower'));
  console.log(chalk.green('Birthstone: '), chalk.yellow(birthstone));
  console.log(chalk.green('Birth Flower: '), chalk.yellow(birthFlower));

  // Historical Events
  console.log('\n' + chalk.bold.red('📜 Historical Events'));
  historicalEvents.slice(0, 3).forEach(event => {
    console.log(chalk.green(`${event.year}: `), chalk.yellow(event.text));
  });

  console.log('━'.repeat(50));
}

// Main Function
async function getBirthdayInfo(date) {
  try {
    // Validate the date format
    if (!isValidDate(date)) {
      console.error(chalk.red('Invalid date format. Please use DD/MM/YYYY.'));
      process.exit(1);
    }

    const [day, month, year] = date.split('/').map(Number);
    const birthDate = new Date(year, month - 1, day);

    if (isNaN(birthDate)) {
      console.error(chalk.red('Invalid date provided. Please ensure the date is valid.'));
      process.exit(1);
    }

    await displayResults(date, birthDate);
  } catch (error) {
    console.error(chalk.red('Error fetching birthday information:'), error.message);
  }
}

// CLI Setup
program
  .version('1.0.0')
  .description('Get comprehensive birthday insights including zodiac signs, numerology, and biorhythm')
  .argument('<date>', 'Birthday date in DD/MM/YYYY format (e.g., 07/12/1990)')
  .action(getBirthdayInfo);

program.parse(process.argv);