import {
    getZodiacSign,
    getChineseZodiac,
    calculateLifePathNumber,
    calculateAge,
    getNextBirthday,
    getDayOfYear,
    getMoonPhase,
    isValidDate,
    getHistoricalEvents,
  } from '../src/index.js';
  
  describe('Birthday Insights Tests', () => {
    describe('Date Validation', () => {
      it('should validate a correct date in dd/mm/yyyy format', () => {
        expect(isValidDate('07/12/1990')).toBe(true);
      });
  
      it('should reject an invalid date format', () => {
        expect(isValidDate('1990/12/07')).toBe(false); // Wrong format
        expect(isValidDate('07-12-1990')).toBe(false); // Wrong separator
        expect(isValidDate('07/12/90')).toBe(false);   // Short year
      });
  
      it('should reject an invalid date', () => {
        expect(isValidDate('31/02/2000')).toBe(false); // Invalid date
        expect(isValidDate('29/02/2021')).toBe(false); // Not a leap year
      });
    });
  
    describe('Zodiac Sign Calculation', () => {
      it('should return the correct zodiac sign for a given date', () => {
        expect(getZodiacSign(7, 12).sign).toBe('Sagittarius');
        expect(getZodiacSign(1, 1).sign).toBe('Capricorn');
        expect(getZodiacSign(19, 1).sign).toBe('Capricorn');
        expect(getZodiacSign(20, 1).sign).toBe('Aquarius');
      });
    });
  
    describe('Chinese Zodiac Calculation', () => {
      it('should return the correct Chinese zodiac for a given year', () => {
        expect(getChineseZodiac(1990).animal).toBe('Horse');
        expect(getChineseZodiac(2000).animal).toBe('Dragon');
        expect(getChineseZodiac(2023).animal).toBe('Rabbit');
      });
    });
  
    describe('Life Path Number Calculation', () => {
      it('should return the correct life path number for a given date', () => {
        expect(calculateLifePathNumber(7, 12, 1990)).toBe(11); // 7 + 12 + 1990 = 2009 → 2 + 0 + 0 + 9 = 11
        expect(calculateLifePathNumber(1, 1, 2000)).toBe(3);   // 1 + 1 + 2000 = 2002 → 2 + 0 + 0 + 2 = 4
      });
    });
  
    describe('Age Calculation', () => {
      it('should return the correct age for a given birthdate', () => {
        const today = new Date();
        const birthDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
        expect(calculateAge(birthDate)).toBe(25);
      });
  
      it('should handle birthdays that haven\'t occurred yet this year', () => {
        const today = new Date();
        const birthDate = new Date(today.getFullYear() - 25, today.getMonth() + 1, today.getDate());
        expect(calculateAge(birthDate)).toBe(24);
      });
    });
  
    describe('Next Birthday Calculation', () => {
      it('should return the correct number of days until the next birthday', () => {
        const today = new Date();
        const birthDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5); // 5 days from today
        const result = getNextBirthday(birthDate);
        expect(result.daysUntil).toBe(5);
      });
  
      it('should handle birthdays that have already passed this year', () => {
        const today = new Date();
        const birthDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5); // 5 days ago
        const result = getNextBirthday(birthDate);
        expect(result.daysUntil).toBe(360); // Approx. days until next birthday
      });
    });
  
    describe('Day of the Year Calculation', () => {
      it('should return the correct day of the year for a given date', () => {
        const date = new Date(2023, 0, 1); // January 1, 2023
        expect(getDayOfYear(date)).toBe(1);
  
        const date2 = new Date(2023, 11, 31); // December 31, 2023
        expect(getDayOfYear(date2)).toBe(365);
      });
    });
  
    describe('Moon Phase Calculation', () => {
      it('should return the correct moon phase for a given date', () => {
        const date = new Date(2023, 0, 1); // January 1, 2023
        const phase = getMoonPhase(date);
        expect(typeof phase).toBe('string');
      });
    });
  
    describe('Historical Events API', () => {
      let axiosGetMock;
  
      beforeEach(() => {
        axiosGetMock = jest.spyOn(axios, 'get');
      });
  
      afterEach(() => {
        axiosGetMock.mockRestore();
      });
  
      it('should fetch historical events for a given date', async () => {
        const mockEvents = [
          { year: '1990', text: 'Event 1' },
          { year: '1990', text: 'Event 2' },
        ];
        axiosGetMock.mockResolvedValue({ data: { data: { Events: mockEvents } } });
  
        const date = new Date(1990, 11, 7);
        const events = await getHistoricalEvents(date);
        expect(events).toEqual(mockEvents);
      });
  
      it('should handle API errors', async () => {
        axiosGetMock.mockRejectedValue(new Error('API Error'));
  
        const date = new Date(1990, 11, 7);
        await expect(getHistoricalEvents(date)).rejects.toThrow('API Error');
      });
    });
  });