export const faqs = (w = 'Maya') => [
  ['How much is the deposit and why do I need one?', `Deposits start at ₱300 for consultations and ₱500–₱3,000 for tattoos depending on size. It secures your slot and is deducted from your final price. You can pay it straight from ${w} when you book.`],
  [`How do I pay the deposit through ${w}?`, `At the last step of booking, scan our ${w} QR (or send to our ${w} number), then type the reference number and upload a screenshot of the receipt. If instant ${w} checkout is turned on, you can pay in-app and it is confirmed automatically.`],
  ['Do you offer home service?', 'Yes! We bring a fully sterile, portable setup to your home, office or event. A transport fee applies, and we ask for a minimum of 2 tattoos or ₱5,000 per visit. See the Home Service page for coverage areas.'],
  ['Does it hurt?', 'Honestly, a little. Most people describe it as a hot scratch. Ribs, feet and spine are more sensitive; forearms and thighs are easier. We take breaks whenever you need them.'],
  ['Is it safe and clean?', 'Every needle and cartridge is single-use and opened in front of you. Surfaces are wrapped and disinfected between clients, and we use vegan, reputable inks.'],
  ['How old do I need to be?', 'You must be 18+ with a valid ID. Clients 16–17 may be tattooed with a parent or guardian present and signing the waiver.'],
  ['Can I bring my own design?', 'Absolutely. Upload references when you book. Your artist will redraw and adapt it so it fits your body and ages well.'],
  ['What if I need to reschedule?', 'Message us at least 48 hours before your appointment and we will move your deposit to a new date once, free of charge.'],
];

export default function Faq({ items, wallet = 'Maya' }) {
  items = items || faqs(wallet);
  return (
    <div className="faq">
      {items.map(([q, a], i) => (
        <details key={i} data-reveal style={{ '--d': `${i * 0.05}s` }}>
          <summary>{q}<i aria-hidden="true" /></summary>
          <div className="ans">{a}</div>
        </details>
      ))}
    </div>
  );
}
