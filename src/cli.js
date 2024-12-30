#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import {
  isValidDate,
  getZodiacSign,
  getChineseZodiac,
  calculateLifePathNumber,
  calculateAge,
  getNextBirthday,
  getDayOfYear,
  getMoonPhase,
  getHistoricalEvents
} from './index.js';
import { DAYS, ZODIAC_SIGNS, CHINESE_ZODIAC, BIRTHSTONES, BIRTH_FLOWERS } from './data.js';

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
  console.log(chalk.green('🎉 Days until next birthday: '), chalk.yellow(nextBirthday.daysUntil));

  // Zodiac Information
  console.log('\n' + chalk.bold.magenta('✨ Astrological Profile ✨'));
  const fullZodiacInfo = ZODIAC_SIGNS.find(z => z.sign === zodiacSign.sign);
  console.log(chalk.green('⭐ Western Zodiac: '), 
    chalk.yellow(`${fullZodiacInfo.sign} (${fullZodiacInfo.element}, ruled by ${fullZodiacInfo.planet})`));
  console.log(chalk.green('🔮 Zodiac Traits: '), chalk.yellow(fullZodiacInfo.traits.join(', ')));

  // Chinese Zodiac
  const fullChineseInfo = CHINESE_ZODIAC[birthDate.getFullYear() % 12];
  console.log(chalk.green('🏮 Chinese Zodiac: '), 
    chalk.yellow(`${fullChineseInfo.animal} (${fullChineseInfo.element})`));
  console.log(chalk.green('🎋 Chinese Zodiac Traits: '), 
    chalk.yellow(fullChineseInfo.traits.join(', ')));

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

function getSeason(month) {
  if (month >= 3 && month <= 5) return 'Spring';
  if (month >= 6 && month <= 8) return 'Summer';
  if (month >= 9 && month <= 11) return 'Autumn';
  return 'Winter';
}

async function getBirthdayInfo(date) {
  try {
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
    process.exit(1);
  }
}

// CLI Setup
program
  .version('1.0.0')
  .description('Get comprehensive birthday insights including zodiac signs, numerology, and historical events')
  .argument('<date>', 'Birthday date in DD/MM/YYYY format (e.g., 07/12/1990)')
  .action(getBirthdayInfo);

program.parse(process.argv);