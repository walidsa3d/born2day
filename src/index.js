#!/usr/bin/env node
import { DAYS, ZODIAC_SIGNS, CHINESE_ZODIAC, BIRTHSTONES, BIRTH_FLOWERS } from './data.js';
import { program } from 'commander';
import chalk from 'chalk';
import axios from 'axios';
import { Moon } from "lunarphase-js";

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

function getSeason(month) {
  if (month >= 3 && month <= 5) {
    return 'Spring';
  } else if (month >= 6 && month <= 8) {
    return 'Summer';
  } else if (month >= 9 && month <= 11) {
    return 'Autumn';
  } else {
    return 'Winter';
  }
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
  const season = getSeason(birthDate.getMonth() + 1);

  console.log(chalk.bold.blue('\n🎂 Birthday Insights 🎂'));
  console.log('━'.repeat(50));

  // Basic Information
  console.log(chalk.green('📅 Date of Birth: '), chalk.yellow(date));
  console.log(chalk.green('📆 Day of the Week: '), chalk.yellow(dayOfWeek));
  console.log(chalk.green('🎈 Age: '), chalk.yellow(age));
  console.log(chalk.green('🌍 Day of the Year: '), chalk.yellow(dayOfYear));
  console.log(chalk.green('🍂 Season of Birth: '), chalk.yellow(season));
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

export {
  getZodiacSign,
  getChineseZodiac,
  calculateLifePathNumber,
  calculateAge,
  getNextBirthday,
  getDayOfYear,
  getMoonPhase,
  isValidDate,
  getHistoricalEvents,
};