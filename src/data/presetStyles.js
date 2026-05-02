const presetStyles = [
  {
    id: 'professional',
    name: 'Profesionálny',
    nameSk: 'Profesionálny',
    description: 'Čistý, seriózny vzhľad pre firmu a SZČO',
    primary: '#1e40af',
    secondary: '#3b82f6',
    accent: '#10b981',
    fonts: { heading: 'Montserrat', body: 'Open Sans' },
    tone: 'Formálny, vecý, dôveryhodný. Komunikujeme faktami a jasnými výhodami. Žiadne emodži v oficiálnych dokumentoch.',
    industries: ['IT', 'Služby', 'Vzdelávanie']
  },
  {
    id: 'playful',
    name: 'Hravý',
    nameSk: 'Hravý',
    description: 'Veselý a energický štýl pre kreatívcov a deti',
    primary: '#ec4899',
    secondary: '#f472b6',
    accent: '#fbbf24',
    fonts: { heading: 'Nunito', body: 'Quicksand' },
    tone: 'Priateľský, energický, inšpiratívny. Používame emodži 🎉, oslovujeme "ty", sme blízko k zákazníkovi.',
    industries: ['E-shop', 'Nezisk', 'Ostatné']
  },
  {
    id: 'luxury',
    name: 'Luxusný',
    nameSk: 'Luxusný',
    description: 'Elegantný a prémiový vzhľad pre high-end značky',
    primary: '#000000',
    secondary: '#374151',
    accent: '#d4af37',
    fonts: { heading: 'Playfair Display', body: 'Lato' },
    tone: 'Exkluzívny, diskrétny, zdržanlivý. Používame sofistikovaný jazyk, zdôrazňujeme kvalitu a tradíciu.',
    industries: ['Reštaurácia', 'Služby', 'Ostatné']
  },
  {
    id: 'traditional',
    name: 'Tradičný',
    nameSk: 'Tradičný',
    description: 'Klasický, dôveryhodný štýl pre tradičné remeslá',
    primary: '#7c2d12',
    secondary: '#b45309',
    accent: '#ca8a04',
    fonts: { heading: 'Merriweather', body: 'Source Sans Pro' },
    tone: 'Úctivý, stabilný, spoľahlivý. Oslovujeme "Vážený zákazník", kladieme dôraz na skúsenosti a tradíciu.',
    industries: ['Remeslo', 'Reštaurácia', 'Služby']
  },
  {
    id: 'modern',
    name: 'Moderný',
    nameSk: 'Moderný',
    description: 'Minimalistický, technologický vzhľad pre IT a startup',
    primary: '#7c3aed',
    secondary: '#a78bfa',
    accent: '#06b6d4',
    fonts: { heading: 'Poppins', body: 'Inter' },
    tone: 'Inovatívny, priamy, efektívny. Komunikujeme jasne a stručne, zameriavame sa na riešenia a výsledky.',
    industries: ['IT', 'E-shop', 'Vzdelávanie']
  },
  {
    id: 'eco',
    name: 'Eko',
    nameSk: 'Eko',
    description: 'Prírodný, udržateľný štýl pre zelené firmy',
    primary: '#166534',
    secondary: '#22c55e',
    accent: '#a3e635',
    fonts: { heading: 'Josefin Sans', body: 'Raleway' },
    tone: 'Autentický, starostlivý, transparentný. Komunikujeme hodnoty udržateľnosti a starostlivosti o komunitu.',
    industries: ['Nezisk', 'Reštaurácia', 'Ostatné']
  },
  {
    id: 'bold',
    name: 'Odvážny',
    nameSk: 'Odvážny',
    description: 'Silný, kontrastný štýl pre módne a kreatívne brandy',
    primary: '#dc2626',
    secondary: '#f87171',
    accent: '#fbbf24',
    fonts: { heading: 'Oswald', body: 'Roboto' },
    tone: 'Sebauvedomelý, dynamický, provokatívny. Nebojíme sa byť iní, používame silné slogany a výrazné vyjadrovanie.',
    industries: ['E-shop', 'Ostatné', 'Nezisk']
  },
  {
    id: 'minimal',
    name: 'Minimalistický',
    nameSk: 'Minimalistický',
    description: 'Čistý, vzdušný dizajn s dôrazom na negatívny priestor',
    primary: '#1f2937',
    secondary: '#9ca3af',
    accent: '#3b82f6',
    fonts: { heading: 'Inter', body: 'Inter' },
    tone: 'Jednoduchý, jasný, funkčný. Menej je viac. Komunikujeme priamo bez zbytočných ozdobných prvkov.',
    industries: ['IT', 'Služby', 'Vzdelávanie']
  }
];

export default presetStyles;
