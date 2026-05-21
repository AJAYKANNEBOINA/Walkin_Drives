import { useState } from 'react'

const LOGO_FILES: Record<string, string> = {
  'Genpact':                    '/logos/genpact.svg',
  'Capgemini':                  '/logos/capgemini.svg',
  'HDFC Life':                  '/logos/hdfc.svg',
  'Hewlett Packard Enterprise': '/logos/hpe.svg',
  'Kotak Mahindra Bank':        '/logos/kotak.svg',
  'TCS':                        '/logos/tcs.svg',
  'Wipro':                      '/logos/wipro.svg',
  'Infosys BPM':                '/logos/infosys.svg',
  'LTIMindtree':                '/logos/ltim.svg',
  'Tech Mahindra':              '/logos/techm.svg',
  'ICICI Bank':                 '/logos/icici.svg',
  'Sopra Steria':               '/logos/sopra.svg',
}

interface CompanyLogoProps {
  name: string
  /** sm = dashboard table row, md = job card, lg = drive detail header, marquee = partner strip */
  size?: 'sm' | 'md' | 'lg' | 'marquee'
  className?: string
}

const SIZE_MAP = {
  sm:      { wrapper: 'h-9 w-9',   img: 'max-h-6 max-w-[5rem]',   pad: 'p-1',   text: 'text-[10px]' },
  md:      { wrapper: 'h-11 w-11', img: 'max-h-7 max-w-[3.5rem]', pad: 'p-1.5', text: 'text-xs'     },
  lg:      { wrapper: 'h-14 w-14', img: 'max-h-9 max-w-[4.5rem]', pad: 'p-2',   text: 'text-base'   },
  marquee: { wrapper: 'h-10 w-28', img: 'max-h-8 max-w-[6.5rem]', pad: 'p-2',   text: 'text-sm'     },
}

export function CompanyLogo({ name, size = 'md', className = '' }: CompanyLogoProps) {
  const [failed, setFailed] = useState(false)
  const src = LOGO_FILES[name]
  const { wrapper, img, pad, text } = SIZE_MAP[size]
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className={`${wrapper} shrink-0 grid place-items-center rounded-xl border border-border bg-white overflow-hidden ${pad} ${className}`}>
      {src && !failed ? (
        <img
          src={src}
          alt={name}
          className={`${img} w-full h-full object-contain`}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className={`${text} font-bold text-foreground`}>{initials}</span>
      )}
    </div>
  )
}
