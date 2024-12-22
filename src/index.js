import { program } from 'commander';
import chalk from 'chalk';
import axios from 'axios';

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

const LIFE_PATH_NUMBERS = {
  1: 'Leader, Independent, Ambitious',
  2: 'Cooperative, Diplomatic, Sensitive',
  3: 'Creative, Expressive, Social',
  4: 'Practical, Organized, Hard-working',
  5: 'Adventurous, Freedom-loving, Versatile',
  6: 'Nurturing, Responsible, Caring',
  7: 'Analytical, Introspective, Perfectionist',
  8: 'Ambitious, Business-minded, Power-seeking',
  9: 'Humanitarian, Compassionate, Artistic'
};

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

function calculateBiorhythm(birthDate) {
  const today = new Date();
  const days = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
  
  return {
    physical: Math.sin((2 * Math.PI * days) / 23) * 100,
    emotional: Math.sin((2 * Math.PI * days) / 28) * 100,
    intellectual: Math.sin((2 * Math.PI * days) / 33) * 100
  };
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

function getNextBirthday(birthDate) {
  const today = new Date();
  const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  const daysUntil = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
  return { date: nextBirthday, daysUntil };
}

function displayResults(date, birthDate, dayOfWeek, zodiacSign, chineseZodiac, age) {
  const lifePathNum = calculateLifePathNumber(
    birthDate.getDate(),
    birthDate.getMonth() + 1,
    birthDate.getFullYear()
  );
  
  const biorhythm = calculateBiorhythm(birthDate);
  const nextBirthday = getNextBirthday(birthDate);
  
  console.log(chalk.bold.blue('\n🎂 Birthday Insights 🎂'));
  console.log('━'.repeat(50));
  
  // Basic Information
  console.log(chalk.green('📅 Date of Birth: '), chalk.yellow(date));
  console.log(chalk.green('📆 Day of the Week: '), chalk.yellow(dayOfWeek));
  console.log(chalk.green('🎈 Age: '), chalk.yellow(age));
  
  // Next Birthday
  console.log(chalk.green('🎉 Days until next birthday: '), 
    chalk.yellow(nextBirthday.daysUntil));
  
  // Zodiac Information
  console.log('\n' + chalk.bold.magenta('✨ Astrological Profile ✨'));
  console.log(chalk.green('⭐ Western Zodiac: '), 
    chalk.yellow(`${zodiacSign.sign} (${zodiacSign.element}, ruled by ${zodiacSign.planet})`));
  console.log(chalk.green('🔮 Zodiac Traits: '), 
    chalk.yellow(zodiacSign.traits.join(', ')));
  
  // Chinese Zodiac
  console.log(chalk.green('🏮 Chinese Zodiac: '), 
    chalk.yellow(`${chineseZodiac.animal} (${chineseZodiac.element})`));
  console.log(chalk.green('🎋 Chinese Zodiac Traits: '), 
    chalk.yellow(chineseZodiac.traits.join(', ')));
  
  // Numerology
  console.log('\n' + chalk.bold.cyan('🔢 Numerology'));
  console.log(chalk.green('Life Path Number: '), 
    chalk.yellow(`${lifePathNum} - ${LIFE_PATH_NUMBERS[lifePathNum]}`));
  
  // Biorhythm
  console.log('\n' + chalk.bold.yellow('〰️ Current Biorhythm'));
  console.log(chalk.green('Physical: '), 
    chalk.yellow(`${biorhythm.physical.toFixed(1)}%`));
  console.log(chalk.green('Emotional: '), 
    chalk.yellow(`${biorhythm.emotional.toFixed(1)}%`));
  console.log(chalk.green('Intellectual: '), 
    chalk.yellow(`${biorhythm.intellectual.toFixed(1)}%`));
  
  console.log('━'.repeat(50));
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
    
    const dayOfWeek = DAYS[birthDate.getDay()];
    const zodiacSign = getZodiacSign(day, month);
    const chineseZodiac = getChineseZodiac(year);
    const age = calculateAge(birthDate);
    
    displayResults(date, birthDate, dayOfWeek, zodiacSign, chineseZodiac, age);
    
  } catch (error) {
    console.error(chalk.red('Error fetching birthday information:'), error.message);
  }
}

program
  .version('1.0.0')
  .description('Get comprehensive birthday insights including zodiac signs, numerology, and biorhythm')
  .argument('<date>', 'Birthday date in DD/MM/YYYY format (e.g., 07/12/1990)')
  .action(getBirthdayInfo);

program.parse(process.argv);