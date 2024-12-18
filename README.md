# born2day

**born2day** is a simple CLI tool to calculate your day of birth, zodiac sign, and some facts based on the date you provide.

---

## Features

- 🗓️ **Day of Birth**: Find the exact day of the week you were born.
- ♒ **Zodiac Sign**: Get your astrological zodiac sign.
- 💡 **Age**: G.

---

## Installation

Install globally via npm:

```bash
npm install -g born2day
```

---

## Usage

Simply use the `born2day` command followed by your birth date in `YYYY-MM-DD` format:

```bash
born2day 16/07/1990
```

### Example Output

```bash
🌟 Born2Day 🌟

📅 Date of Birth: 1990-07-15
📌 Day of the Week: Sunday
♋ Zodiac Sign: Cancer
```

---

## Options

You can customize the output with the following options:

```bash
born2day [options] <date>
```

### Available Options:
- `-h, --help`: Display help information.
- `-v, --version`: Display the current version of the package.

---

## How It Works

1. **Date Parsing**: Takes your input date and validates it.
2. **Day Calculation**: Determines the day of the week using algorithms.
3. **Zodiac Detection**: Matches your date to the zodiac sign.
4. **Age**: The curren age of the person.

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests. Please follow our [contribution guidelines](CONTRIBUTING.md).

---

## License

This project is licensed under the [MIT License](LICENSE).

---
