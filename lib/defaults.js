export const DEFAULT_SETTINGS = {
  shop: {
    name: 'MUGNA Tattoo Co.',
    tagline: 'Ink that is made, not copied.',
    about:
      '“Mugna” means to create. Since 2014 we have been a small, independent studio obsessed with custom work: every piece drawn by hand, every needle single-use, every client treated like family. Walk in with an idea, walk out with art that is only yours.',
    founded: '2014',
    phone: '+63 917 123 4567',
    email: 'hello@mugnatattoo.com',
    address: 'Mango Avenue, Cebu City, 6000 Cebu, Philippines',
    lat: 10.3157,
    lng: 123.8854,
    hours: [
      { day: 'Mon – Fri', time: '11:00 AM – 9:00 PM' },
      { day: 'Saturday', time: '10:00 AM – 10:00 PM' },
      { day: 'Sunday', time: 'Home service & appointments only' },
    ],
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    tiktok: 'https://tiktok.com/',
    aboutImage1: '',
    aboutImage2: '',
  },
  booking: {
    timeSlots: ['11:00', '13:00', '15:00', '17:00', '19:00'],
    closedWeekdays: [],
    homeServiceFee: 1000,
    homeServiceAreas: 'Cebu City, Mandaue, Lapu-Lapu, Talisay, Consolacion and Liloan. Other areas on request.',
    homeServiceMinimum: 'Minimum of 2 tattoos or ₱5,000 total per visit.',
    leadDays: 1,
    policy:
      'Your deposit secures your slot and goes toward the final price. Deposits are non-refundable but can be moved once with 48 hours notice.',
  },
  gcash: {
    provider: 'maya',
    accountName: 'MUGNA TATTOO CO.',
    number: '0917 123 4567',
    qrUrl: '/art/maya-qr-sample.svg',
  },
};
