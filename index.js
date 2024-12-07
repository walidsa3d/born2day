import { program } from 'commander';
import chalk from 'chalk';
import axios from 'axios';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

async function getBirthdayInfo(date) {
  try {
    // Parse the input date
    const [month, day] = date.split('/').map(Number);
    
    // Create Date object
    const birthDate = new Date(new Date().getFullYear(), month - 1, day);
    
    // Get day of the week
    const dayOfWeek = DAYS[birthDate.getDay()];
    
    // Fetch historical events using Wikipedia API
    const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${month}_${day}`);
    const pageContent = response.data.extract;
    
    // Display results
    console.log(chalk.bold.blue('🎂 Birthday Insights 🎂'));
    console.log(chalk.green('Day of the Week:'), chalk.yellow(dayOfWeek));
    
    console.log(chalk.yellow('\nHistorical Events:'));
    console.log(chalk.white(pageContent || 'No specific historical events found.'));
  } catch (error) {
    console.error(chalk.red('Error fetching birthday information:'), error.message);
  }
}

program
  .version('1.0.0')
  .description('Get day of the week and historical events for a birthday')
  .argument('<date>', 'Birthday date in MM/DD format (e.g., 12/07)')
  .action(getBirthdayInfo);

program.parse(process.argv);