import { program } from 'commander';
import chalk from 'chalk';
import axios from 'axios';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const ZODIAC_SIGNS = [
  { sign: 'Capricorn', start: '01-01', end: '01-19' },
  { sign: 'Aquarius', start: '01-20', end: '02-18' },
  { sign: 'Pisces', start: '02-19', end: '03-20' },
  { sign: 'Aries', start: '03-21', end: '04-19' },
  { sign: 'Taurus', start: '04-20', end: '05-20' },
  { sign: 'Gemini', start: '05-21', end: '06-20' },
  { sign: 'Cancer', start: '06-21', end: '07-22' },
  { sign: 'Leo', start: '07-23', end: '08-22' },
  { sign: 'Virgo', start: '08-23', end: '09-22' },
  { sign: 'Libra', start: '09-23', end: '10-22' },
  { sign: 'Scorpio', start: '10-23', end: '11-21' },
  { sign: 'Sagittarius', start: '11-22', end: '12-21' },
  { sign: 'Capricorn', start: '12-22', end: '12-31' },
];

const CHINESE_ZODIAC = ['Monkey', 'Rooster', 'Dog', 'Pig', 'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat'];

function getZodiacSign(day, month) {
  const dateStr = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return ZODIAC_SIGNS.find(z => dateStr >= z.start && dateStr <= z.end)?.sign || 'Unknown';
}

function getChineseZodiac(year) {
  return CHINESE_ZODIAC[year % 12];
}

function calculateAge(birthDate) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

function displayResults(date, dayOfWeek, zodiacSign, chineseZodiac, age) {
  console.log(chalk.bold.blue('\n🎂 Birthday Insights 🎂'));
  console.log('━'.repeat(40));
  console.log(chalk.green('📅 Date of Birth:    '), chalk.yellow(date));
  console.log(chalk.green('📆 Day of the Week:  '), chalk.yellow(dayOfWeek));
  console.log(chalk.green('⭐ Zodiac Sign:      '), chalk.yellow(zodiacSign));
  console.log(chalk.green('🏮 Chinese Zodiac:   '), chalk.yellow(chineseZodiac));
  console.log(chalk.green('🎈 Age:              '), chalk.yellow(age));
  console.log('━'.repeat(40));
}

async function getBirthdayInfo(date) {
  try {
    const [day, month, year] = date.split('/').map(Number);
    if (!day || !month || !year || month < 1 || month > 12 || day < 1 || day > 31) {
      console.error(chalk.red('Invalid date format. Please use DD/MM/YYYY.'));
      process.exit(1);
    }
    const birthDate = new Date(year, month - 1, day);

    if (isNaN(birthDate)) {
      console.error(chalk.red('Invalid date provided. Please ensure the date is valid.'));
      process.exit(1);
    }

    // Get day of the week
    const dayOfWeek = DAYS[birthDate.getDay()];
    
    // Get zodiac sign, Chinese zodiac, and age
    const zodiacSign = getZodiacSign(day, month);
    const chineseZodiac = getChineseZodiac(year);
    const age = calculateAge(birthDate);

    // Display results using the new display function
    displayResults(date, dayOfWeek, zodiacSign, chineseZodiac, age);

  } catch (error) {
    console.error(chalk.red('Error fetching birthday information:'), error.message);
  }
}

program
  .version('1.0.0')
  .description('Get day of the week, zodiac signs, age, and historical events for a birthday')
  .argument('<date>', 'Birthday date in DD/MM/YYYY format (e.g., 07/12/1990)')
  .action(getBirthdayInfo);

program.parse(process.argv);