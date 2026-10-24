import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X, Waves, Leaf } from 'lucide-react';
import heroImage from './assets/awanara-hero.webp';
import villaImage from './assets/villa-garden.webp';
import tableImage from './assets/table-island.webp';
import seaImage from './assets/island-water.webp';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { WA_DISPLAY, waLink } from '@/lib/whatsapp';

const navItems = [
  ['The island', '#island'],
  ['Stay', '#stay'],
  ['At Awanara', '#experience'],
  ['Gather', '#gather'],
];

function dateString(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function App() {
  const today = useMemo(() => dateString(new Date()), []);
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return dateString(d);
  }, []);
  const [arrival, setArrival] = useState(tomorrow);
  const [departure, setDeparture] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return dateString(d);
  });
  const [guests, setGuests] = useState('2');
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [heroPassed, setHeroPassed] = useState(false);
  const [bookingInView, setBookingInView] = useState(false);
  const [bookingReached, setBookingReached] = useState(false);

  useEffect(() => {
    document.title = 'Awanara Langkawi — A quieter kind of island';
    const description = 'Awanara is a small island sanctuary on Langkawi, where the Andaman Sea meets the quiet generosity of Malaysian hospitality.';
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', description);
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.head.appendChild(document.createElement('meta'));
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', 'Awanara Langkawi — A quieter kind of island');
    const ogDescription = document.querySelector('meta[property="og:description"]') || document.head.appendChild(document.createElement('meta'));
    ogDescription.setAttribute('property', 'og:description');
    ogDescription.setAttribute('content', description);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateHeader = () => setHeaderScrolled(window.scrollY > 24);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  useEffect(() => {
    const hero = document.getElementById('home');
    const booking = document.getElementById('booking');
    if (!hero || !booking || !('IntersectionObserver' in window)) return;

    const heroObserver = new IntersectionObserver(([entry]) => {
      setHeroPassed(!entry.isIntersecting);
    });
    const bookingObserver = new IntersectionObserver(
      ([entry]) => {
        setBookingInView(entry.isIntersecting);
        if (entry.isIntersecting) setBookingReached(true);
      },
      { rootMargin: '0px 0px -18% 0px', threshold: 0 },
    );

    heroObserver.observe(hero);
    bookingObserver.observe(booking);
    return () => {
      heroObserver.disconnect();
      bookingObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBookingMessage('');
    setBookingError('');
    if (!arrival || !departure) {
      setBookingError('Choose both an arrival and departure date to continue.');
      return;
    }
    if (arrival < today) {
      setBookingError('Arrival must be today or a later date.');
      return;
    }
    if (departure <= arrival) {
      setBookingError('Departure must be at least one day after arrival.');
      return;
    }
    const guestLabel = `${guests} ${guests === '1' ? 'guest' : 'guests'}`;
    window.open(waLink(`Hello Awanara Langkawi, I would like to check availability.\nArrival: ${arrival}\nDeparture: ${departure}\nTravellers: ${guestLabel}`), '_blank', 'noopener');
    setBookingMessage(`Your dates (${arrival} to ${departure}, ${guestLabel}) are ready to send on WhatsApp to ${WA_DISPLAY}. If WhatsApp did not open, tap the green WhatsApp button.`);
  }

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
    <main className="overflow-x-clip">
      <header className={`fixed lg:absolute z-30 top-0 left-0 w-full px-5 md:px-12 text-[#f4f0e7] transition-[background-color,backdrop-filter,box-shadow] duration-300 ${headerScrolled ? 'bg-[#203b34]/95 backdrop-blur-md shadow-sm lg:bg-transparent lg:backdrop-blur-0 lg:shadow-none' : 'bg-transparent'}`}>
        <div className="max-w-[1440px] mx-auto h-[72px] md:h-[82px] flex items-center justify-between border-b border-white/25">
          <a href="#home" aria-label="Awanara Langkawi home" data-testid="link-home" className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full border border-white/65 flex items-center justify-center text-[16px] serif italic">A</span>
            <span className="leading-none"><span className="block text-[14px] tracking-[.18em] font-semibold">AWANARA</span><span className="block text-[8px] tracking-[.25em] mt-1 opacity-75">LANGKAWI · MALAYSIA</span></span>
          </a>
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-9">
            {navItems.map(([label, href]) => <a key={href} href={href} className="nav-link text-[11px] tracking-[.13em] uppercase" data-testid={`link-nav-${href.slice(1)}`}>{label}</a>)}
          </nav>
          <a href="#booking" className="hidden md:inline-flex items-center gap-3 text-[10px] tracking-[.15em] uppercase border border-white/65 px-5 py-3 hover:bg-[#f4f0e7] hover:text-[#203b34] transition-colors" data-testid="link-book-direct">Plan your stay <ArrowUpRight size={13} /></a>
          <button type="button" className="lg:hidden p-3 -mr-2" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-controls="mobile-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} data-testid="button-mobile-menu">{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <nav id="mobile-navigation" className="mobile-menu lg:hidden absolute top-[72px] md:top-[82px] left-0 w-full px-6 py-5 bg-[#203b34] flex flex-col gap-3 shadow-xl" aria-label="Mobile navigation">
          {navItems.map(([label, href]) => <a key={href} href={href} onClick={closeMenu} className="text-[12px] tracking-[.17em] uppercase py-2 border-b border-white/20" data-testid={`mobile-nav-${href.slice(1)}`}>{label}</a>)}
          <a href="#booking" onClick={closeMenu} className="text-[12px] tracking-[.17em] uppercase py-2" data-testid="mobile-book-link">Plan your stay <ArrowRight size={14} className="inline ml-2" /></a>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" onClick={closeMenu} className="text-[12px] tracking-[.17em] uppercase py-2 text-[#d6a17f]" data-testid="mobile-whatsapp-link">WhatsApp {WA_DISPLAY}</a>
        </nav>}
      </header>

      <section id="home" className="relative min-h-[640px] h-[82svh] max-h-[780px] md:min-h-[760px] md:h-[100svh] md:max-h-[1060px] bg-[#243c37] text-[#f5f1e9] flex items-end">
        <img src={heroImage} alt="Still Andaman Sea framed by Langkawi's distant limestone islands" className="absolute inset-0 w-full h-full object-cover object-center opacity-[.84]" data-testid="img-hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#142b29]/45 via-transparent to-[#142b29]/75" />
        <div className="grain absolute inset-0" />
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 md:px-12 pb-[152px] md:pb-[204px]">
          <p className="eyebrow mb-5 reveal" data-testid="text-hero-location">A small sanctuary · Langkawi, Malaysia</p>
          <h1 className="serif text-[clamp(4.8rem,11vw,10.5rem)] leading-[.79] tracking-[-.045em] max-w-[900px] reveal delay-1" data-testid="text-hero-title">A quieter<br /><em>kind of island.</em></h1>
          <div className="mt-6 md:mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8 reveal delay-2">
            <p className="max-w-[330px] text-[13px] leading-[1.8] text-white/80">Where the rainforest leans toward the sea, and the day finds its own unhurried rhythm.</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <a href="#booking" className="inline-flex min-h-11 items-center gap-3 border border-white/65 px-4 text-[10px] uppercase tracking-[.15em] hover:bg-[#f4f0e7] hover:text-[#203b34] transition-colors" data-testid="link-hero-plan">Plan your stay <ArrowUpRight size={13} /></a>
              <a href="#island" className="inline-flex min-h-11 items-center gap-3 text-[10px] uppercase tracking-[.18em] group" data-testid="link-discover"><span className="w-9 h-9 border border-white/60 rounded-full flex items-center justify-center group-hover:bg-[#f4f0e7] group-hover:text-[#203b34] transition-colors"><ArrowDown size={14} /></span> Discover Awanara</a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full px-5 md:px-12 pb-5 z-10">
          <div className="max-w-[1440px] mx-auto border-t border-white/30 pt-4 flex justify-between text-[9px] tracking-[.18em] uppercase text-white/75">
            <span>06° 18′ N · 99° 51′ E</span><span className="hidden sm:block">A softer edge of the Andaman</span><span>01 / 04</span>
          </div>
        </div>
        <a href="#booking" aria-label="Jump to booking dates" className="absolute bottom-[-34px] z-20 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#d6a17f] text-[#203b34] flex items-center justify-center shadow-lg hover:scale-105 transition-transform" data-testid="button-booking-down"><ArrowDown size={17} /></a>
      </section>

      <section id="booking" className="relative z-10 bg-[#f3f0e8] px-5 md:px-12 py-10 md:py-[72px]">
        <div className="max-w-[1270px] mx-auto">
          <div className="flex items-end justify-between mb-5 md:mb-6">
            <div><p className="eyebrow text-[#aa7558] mb-2">A little time away</p><h2 className="serif text-[32px] md:text-[40px] leading-none">Find your days</h2></div>
            <p className="hidden md:block text-[11px] text-[#65766c]">A note, not a commitment.</p>
          </div>
          <form onSubmit={submitBooking} className="grid grid-cols-2 md:grid-cols-[1fr_1fr_.8fr_auto] border border-[#c9c7b9] bg-[#f7f5ef]" aria-label="Stay enquiry form" data-testid="form-booking">
            <label className="px-3 sm:px-5 py-4 md:py-5 border-b border-r md:border-b-0 md:border-r border-[#d5d1c5] flex flex-col gap-2">
              <span className="eyebrow text-[9px] text-[#748078]">Arrival</span><input className="booking-input text-[14px]" aria-label="Arrival date" type="date" value={arrival} min={today} onChange={(e) => { setArrival(e.target.value); setBookingError(''); setBookingMessage(''); }} data-testid="input-arrival" />
            </label>
            <label className="px-3 sm:px-5 py-4 md:py-5 border-b md:border-b-0 md:border-r border-[#d5d1c5] flex flex-col gap-2">
              <span className="eyebrow text-[9px] text-[#748078]">Departure</span><input className="booking-input text-[14px]" aria-label="Departure date" type="date" value={departure} min={arrival || today} onChange={(e) => { setDeparture(e.target.value); setBookingError(''); setBookingMessage(''); }} data-testid="input-departure" />
            </label>
            <label className="px-3 sm:px-5 py-4 md:py-5 border-r md:border-r border-[#d5d1c5] flex flex-col gap-2">
              <span className="eyebrow text-[9px] text-[#748078]">Travellers</span><select className="booking-input text-[14px] cursor-pointer" aria-label="Number of guests" value={guests} onChange={(e) => { setGuests(e.target.value); setBookingMessage(''); }} data-testid="select-guests">{[1,2,3,4,5,6].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}</select>
            </label>
            <button className="btn-primary bg-[#203b34] text-[#f3f0e8] px-3 sm:px-6 py-4 md:py-5 flex items-center justify-center gap-2 text-[9px] sm:text-[10px] uppercase tracking-[.12em] sm:tracking-[.17em] text-center" type="submit" data-testid="button-check-dates">Check on WhatsApp <ArrowRight size={15} /></button>
          </form>
          {bookingError && <p role="alert" className="mt-3 text-[12px] text-[#a34535]" data-testid="status-booking-error">{bookingError}</p>}
          {bookingMessage && <p role="status" className="mt-3 text-[12px] text-[#315d4c] leading-relaxed" data-testid="status-booking-confirmation">{bookingMessage}</p>}
          {!bookingError && !bookingMessage && <p className="mt-3 text-[10px] text-[#788078]" data-testid="text-booking-note">No payment details. No obligation. Your enquiry opens in WhatsApp ({WA_DISPLAY}).</p>}
        </div>
      </section>

      <section id="island" className="bg-[#203b34] text-[#f3f0e8] px-5 md:px-12 py-16 md:py-36">
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-[.8fr_1.2fr] gap-12 md:gap-28 items-start">
          <div className="reveal">
            <p className="eyebrow text-[#d6a17f] mb-6">Of this place</p>
            <p className="serif text-[clamp(2.7rem,5.5vw,5rem)] leading-[.98] tracking-[-.025em]">Not somewhere<br />to get away.<br /><em>Somewhere to arrive.</em></p>
          </div>
          <div className="md:pt-16 reveal delay-1">
            <p className="text-[15px] leading-[1.9] text-[#d9ded4] max-w-[510px]">At Awanara, the island is not a backdrop. It is the welcome. The salt on the breeze, the shade of old trees, the easy warmth of a table set for one more.</p>
            <p className="text-[15px] leading-[1.9] text-[#d9ded4] max-w-[510px] mt-5">We have made a place to listen—to rain on the roof, to the call of a hill myna, to the stories that make Langkawi feel like nowhere else.</p>
            <a href="#experience" className="mt-8 inline-flex items-center gap-3 text-[10px] tracking-[.17em] uppercase text-[#d6a17f] hover:text-white transition-colors" data-testid="link-our-way">Our way of being <ArrowRight size={14} /></a>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto mt-12 md:mt-28 reveal">
          <div className="photo relative h-[310px] md:h-[510px]">
            <img src={seaImage} alt="A wooden boat moving quietly through the Andaman Sea near Langkawi's limestone islands" className="w-full h-full object-cover" data-testid="img-island-water" />
            <div className="absolute bottom-6 left-6 md:left-10 text-white"><span className="eyebrow text-[9px]">Pulau Langkawi</span><p className="serif text-3xl md:text-5xl mt-1">A whole world, at island pace.</p></div>
          </div>
        </div>
      </section>

      <section id="stay" className="bg-[#e9e5db] px-5 md:px-12 py-16 md:py-36">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 md:gap-8 mb-9 md:mb-16">
            <div className="reveal"><p className="eyebrow text-[#aa7558] mb-5">Rooms to exhale in</p><h2 className="serif text-[clamp(3.3rem,7vw,6.7rem)] leading-[.82] tracking-[-.04em]">Stay a little<br /><em>closer to nature.</em></h2></div>
            <p className="max-w-[270px] text-[13px] leading-[1.8] text-[#5d7067] reveal delay-1">Twenty-eight private hideaways, made with local hands and materials that grow more beautiful with time.</p>
          </div>
          <div className="grid md:grid-cols-[1.35fr_.65fr] gap-5 md:gap-8 items-start">
            <div className="photo relative h-[300px] sm:h-[360px] md:h-[590px] reveal">
              <img src={villaImage} alt="Garden villa opening out to its private plunge pool" className="w-full h-full object-cover" data-testid="img-villa" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-9 bg-gradient-to-t from-[#142b29]/70 to-transparent text-white flex justify-between items-end">
                <div><span className="eyebrow text-[9px]">01 / The Garden House</span><h3 className="serif text-3xl md:text-5xl mt-2">A room of your own.</h3></div>
                <span className="hidden sm:block text-[10px] uppercase tracking-[.12em] pb-1">From MYR 1,180 / night</span>
              </div>
            </div>
            <div className="md:pt-10 reveal delay-1">
              <p className="serif text-[34px] leading-[1.05]">The Garden House</p>
              <p className="mt-5 text-[13px] leading-[1.9] text-[#5d7067]">A cool, considered retreat tucked into the green. Wake to birdsong, step straight into your own little pool, and let the afternoon last as long as it wants.</p>
              <div className="mt-7 border-t border-[#c8c4b8] pt-5 flex flex-wrap gap-x-6 gap-y-3 text-[10px] uppercase tracking-[.12em] text-[#53665e]">
                <span className="flex items-center gap-2"><Waves size={14} /> Private plunge pool</span><span className="flex items-center gap-2"><Leaf size={14} /> 78 m² · garden view</span>
              </div>
              <a href="#booking" className="mt-9 inline-flex items-center gap-3 bg-[#203b34] text-[#f3f0e8] px-6 py-4 text-[10px] uppercase tracking-[.15em] hover:bg-[#bd7b5b] transition-colors" data-testid="link-explore-stays">Explore your stay <ArrowUpRight size={14} /></a>
              <div className="mt-12 md:mt-20 border-t border-[#c8c4b8] pt-5 flex items-center justify-between text-[10px] uppercase tracking-[.12em] text-[#718078]"><span>Also at Awanara</span><span>Cliff House · Sea House</span></div>
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="bg-[#f3f0e8] px-5 md:px-12 py-16 md:py-36">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-[700px] mx-auto mb-10 md:mb-20 reveal"><p className="eyebrow text-[#aa7558] mb-5">The days, your own</p><h2 className="serif text-[clamp(3.5rem,7vw,6.7rem)] leading-[.85] tracking-[-.04em]">Follow what<br /><em>feels good.</em></h2><p className="mt-7 text-[13px] leading-[1.8] text-[#5d7067] max-w-[410px] mx-auto">A few gentle invitations, never an itinerary. Find your own rhythm in the spaces between.</p></div>
          <div className="grid md:grid-cols-3 border-t border-[#c9c7b9]">
            {[
              { num: '01', title: 'The sea, slowly', text: 'Take a wooden sampan out at first light. Find a quiet cove. Come back when you are ready.', meta: 'DAWN · PRIVATE BOAT' },
              { num: '02', title: 'A table of stories', text: 'Cook with our kitchen team, starting at the market and ending over a meal that tastes like home.', meta: 'LATE MORNING · THE PANTRY' },
              { num: '03', title: 'Under the canopy', text: 'Walk the old forest paths with a local naturalist. Listen for the island waking up around you.', meta: 'AS THE DAY COOLS · RAINFOREST' },
            ].map((item, i) => <article key={item.num} className={`py-7 md:py-10 md:px-8 border-b md:border-b-0 md:border-r last:border-r-0 border-[#c9c7b9] reveal delay-${i + 1}`} data-testid={`card-experience-${item.num}`}><span className="eyebrow text-[#ad795c]">{item.num} — {item.meta}</span><h3 className="serif text-[34px] mt-8 mb-4">{item.title}</h3><p className="text-[13px] leading-[1.8] text-[#68786f] max-w-[290px]">{item.text}</p><a href="#booking" className="mt-7 inline-flex items-center gap-2 text-[10px] uppercase tracking-[.15em] hover:text-[#b87958] transition-colors" data-testid={`link-experience-${item.num}`}>Ask us about it <ArrowRight size={13} /></a></article>)}
          </div>
        </div>
      </section>

      <section id="gather" className="bg-[#d9ddd2]">
        <div className="grid md:grid-cols-2">
          <div className="photo min-h-[300px] md:min-h-[670px]"><img src={tableImage} alt="Malaysian breakfast served on a teak table with banana leaf, fruit and kopi" className="w-full h-full object-cover" data-testid="img-table" /></div>
          <div className="px-5 py-12 md:px-[11%] md:py-24 flex flex-col justify-center reveal">
            <p className="eyebrow text-[#aa7558] mb-6">At the long table</p>
            <h2 className="serif text-[clamp(3.4rem,6vw,6rem)] leading-[.85] tracking-[-.04em]">Good food<br /><em>brings us near.</em></h2>
            <p className="mt-7 max-w-[420px] text-[13px] leading-[1.9] text-[#4f665d]">The catch from this morning. Greens from the garden. A little sambal made the way our cooks learned at home. At Awanara, meals are a love letter to the abundance around us.</p>
            <div className="mt-9 pt-5 border-t border-[#b7c0b4] flex items-center justify-between max-w-[420px]"><span className="eyebrow text-[9px] text-[#718078]">The island table</span><span className="serif italic text-[20px]">From dawn to dusk</span></div>
          </div>
        </div>
      </section>

      <section className="bg-[#203b34] text-[#f3f0e8] px-5 md:px-12 py-16 md:py-36">
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-[1fr_.72fr] gap-9 md:gap-28 items-center">
          <div className="reveal">
            <p className="eyebrow text-[#d6a17f] mb-6">A note from our house</p>
            <p className="serif text-[clamp(2.8rem,5vw,5rem)] leading-[1.02]">“We came for three nights. The island gave us a reason to stay present for all of them.”</p>
            <div className="mt-9 flex items-center gap-4"><span className="w-10 h-px bg-[#d6a17f]" /><span className="text-[10px] tracking-[.16em] uppercase text-[#c4d0c3]">Mira & Daniel · Singapore · Guest book, 2024</span></div>
          </div>
          <div className="md:pl-10 border-l border-white/20 md:py-7 reveal delay-1">
            <div className="flex gap-1 text-[#d6a17f] mb-4" aria-label="Five out of five stars">★★★★★</div>
            <p className="text-[12px] text-[#bfcac0] mb-8">Little things we hold close</p>
            <div className="space-y-5">
              {[['28', 'private hideaways'], ['1', 'island to discover'], ['0', 'reasons to hurry']].map(([n, text]) => <div key={text} className="flex items-baseline gap-4 border-b border-white/15 pb-4"><span className="serif text-[40px] text-[#d6a17f]">{n}</span><span className="text-[11px] tracking-[.12em] uppercase text-[#dbe0d6]">{text}</span></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-[#1d342f] text-[#f3f0e8] px-5 md:px-12 py-16 md:py-32 overflow-hidden">
        <div className="absolute -right-20 -top-28 w-[420px] h-[420px] rounded-full border border-white/[.07]" /><div className="absolute -right-4 -top-12 w-[290px] h-[290px] rounded-full border border-white/[.07]" />
        <div className="relative max-w-[1200px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12 reveal">
          <div><p className="eyebrow text-[#d6a17f] mb-6">Let the island find you</p><h2 className="serif text-[clamp(4rem,9vw,8.4rem)] leading-[.8] tracking-[-.04em]">Your time<br /><em>starts here.</em></h2></div>
          <div className="md:max-w-[280px]"><p className="text-[13px] leading-[1.8] text-[#c4d0c3] mb-7">Tell us when you might come. We will be here, happy to help you find your way.</p><a href="#booking" className="inline-flex items-center gap-4 bg-[#d6a17f] text-[#203b34] px-7 py-4 text-[10px] uppercase tracking-[.16em] hover:bg-[#f3f0e8] transition-colors" data-testid="link-start-planning">Start planning <ArrowRight size={15} /></a></div>
        </div>
      </section>

      <footer className="bg-[#f3f0e8] px-5 md:px-12 py-10 md:py-12">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 pb-12 border-b border-[#d0cdc1]">
            <div><a href="#home" className="inline-flex items-center gap-3" data-testid="footer-home"><span className="w-9 h-9 rounded-full border border-[#203b34] flex items-center justify-center serif italic">A</span><span className="text-[13px] tracking-[.18em] font-bold">AWANARA</span></a><p className="mt-5 text-[11px] leading-[1.8] text-[#718078] max-w-[210px]">A small island sanctuary on Langkawi, Malaysia.</p></div>
            <div><p className="eyebrow text-[#aa7558] mb-4">Find us</p><p className="text-[11px] leading-[1.9] text-[#596c63]">Teluk Datai, Langkawi<br />Kedah, Malaysia 07000</p></div>
            <div><p className="eyebrow text-[#aa7558] mb-4">Say hello</p><a href={waLink()} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#596c63] hover:text-[#b87958] inline-flex min-h-11 items-center" data-testid="link-whatsapp">WhatsApp {WA_DISPLAY}</a><br /><a href="tel:+601151198497" className="text-[11px] text-[#596c63] hover:text-[#b87958] inline-flex min-h-11 items-center" data-testid="link-call">Call {WA_DISPLAY}</a></div>
            <div><p className="eyebrow text-[#aa7558] mb-4">Find your way</p><a href="#home" className="text-[11px] text-[#596c63] inline-flex items-center gap-2 hover:text-[#b87958]" data-testid="footer-back-top">Back to the beginning <ArrowUpRight size={12} /></a></div>
          </div>
          <div className="pt-5 flex flex-col sm:flex-row justify-between gap-3 text-[9px] text-[#839087] tracking-[.1em] uppercase"><span>© 2026 Awanara Langkawi · Photos are illustrative, not the actual property</span><span>Made with care on Pulau Langkawi</span></div>
        </div>
      </footer>
    </main>
    <WhatsAppButton />
    {heroPassed && !bookingReached && !bookingInView && !menuOpen && (
      <a href="#booking" className="mobile-booking-bar lg:hidden" aria-label="Jump to the stay planner" data-testid="link-mobile-stay">
        <span><span className="block text-[9px] uppercase tracking-[.18em] text-white/70">A little time away</span><span className="block mt-1 text-[13px]">Plan your stay</span></span>
        <span className="mobile-booking-arrow"><ArrowUpRight size={16} /></span>
      </a>
    )}
    </>
  );
}

export default App;
