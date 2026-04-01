"use client"

import * as React from "react"
import { Check, ChevronDown, Search } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"

export interface Country {
  name: string
  code: string
  flag: string
  prefix: string
}

const COUNTRIES: Country[] = [
  { name: "Ecuador", code: "ec", flag: "https://flagcdn.com/ec.svg", prefix: "+593" },
  { name: "México", code: "mx", flag: "https://flagcdn.com/mx.svg", prefix: "+52" },
  { name: "Colombia", code: "co", flag: "https://flagcdn.com/co.svg", prefix: "+57" },
  { name: "Perú", code: "pe", flag: "https://flagcdn.com/pe.svg", prefix: "+51" },
  { name: "Argentina", code: "ar", flag: "https://flagcdn.com/ar.svg", prefix: "+54" },
  { name: "Chile", code: "cl", flag: "https://flagcdn.com/cl.svg", prefix: "+56" },
  { name: "España", code: "es", flag: "https://flagcdn.com/es.svg", prefix: "+34" },
  { name: "Estados Unidos", code: "us", flag: "https://flagcdn.com/us.svg", prefix: "+1" },
  { name: "Panamá", code: "pa", flag: "https://flagcdn.com/pa.svg", prefix: "+507" },
  { name: "Venezuela", code: "ve", flag: "https://flagcdn.com/ve.svg", prefix: "+58" },
]

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onValueChange?: (value: string) => void
}

/**
 * Premium Phone Input with Country Selector (Expert UI-UX).
 * Defaults to Ecuador (+593).
 */
export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value, defaultValue, onChange, onValueChange, ...props }, ref) => {
    // Basic logic to extract prefix and number
    // For a real implementation, we'd use a library like libphonenumber-js
    const [open, setOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [selectedCountry, setSelectedCountry] = React.useState<Country>(() => {
      const initialValue = (value || defaultValue || "") as string
      return COUNTRIES.find((c) => initialValue.startsWith(c.prefix)) ?? (COUNTRIES[0] as Country)
    })
    
    // Local state for the number without prefix
    const [localNumber, setLocalNumber] = React.useState(() => {
      const initialValue = (value || defaultValue || "") as string
      const country = COUNTRIES.find((c) => initialValue.startsWith(c.prefix))
      if (country) return initialValue.replace(country.prefix, "").trim()
      return initialValue
    })

    React.useEffect(() => {
      if (value) {
        const country = COUNTRIES.find((c) => value.startsWith(c.prefix))
        if (country) {
          setSelectedCountry(country)
          setLocalNumber(value.replace(country.prefix, "").trim())
        } else {
          setLocalNumber(value)
        }
      }
    }, [value])

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.replace(/\D/g, "") // Only numbers
      setLocalNumber(val)
      const fullValue = val === "" ? "" : `${selectedCountry.prefix} ${val}`.trim()
      
      if (onValueChange) onValueChange(fullValue)
      if (onChange) {
        const event = {
          ...e,
          target: { ...e.target, value: fullValue },
        } as React.ChangeEvent<HTMLInputElement>
        onChange(event)
      }
    }

    const handleCountrySelect = (country: Country) => {
      setSelectedCountry(country)
      setOpen(false)
      const fullValue = localNumber === "" ? "" : `${country.prefix} ${localNumber}`.trim()
      if (onValueChange) onValueChange(fullValue)
    }

    const filteredCountries = COUNTRIES.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.prefix.includes(searchQuery)
    )

    return (
      <div className={cn(
        "flex h-11 w-full rounded-2xl bg-zinc-900/50 border border-white/10 overflow-hidden focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-[#5e5ce6]/20 transition-all shadow-inner",
        className
      )}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              type="button"
              role="combobox"
              aria-expanded={open}
              className="h-full px-3 gap-2 hover:bg-white/5 rounded-none border-r border-white/5 text-sm font-bold text-white shrink-0"
            >
              <img 
                src={selectedCountry.flag} 
                alt={selectedCountry.name}
                className="w-5 h-3.5 object-cover shadow-sm"
              />
              <ChevronDown className="size-3 text-zinc-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[240px] p-2 bg-zinc-950 border-white/10 rounded-2xl shadow-2xl overflow-hidden" align="start">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-zinc-500" />
              <input 
                className="w-full bg-white/5 border-none rounded-xl h-9 pl-8 pr-3 text-[11px] font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/10"
                placeholder="Buscar país o prefijo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="max-h-[240px] overflow-y-auto space-y-1 custom-scrollbar">
              {filteredCountries.length === 0 ? (
                <p className="p-3 text-[10px] text-zinc-500 text-center font-bold">No se encontraron resultados</p>
              ) : (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-white/5 rounded-xl text-zinc-300 hover:text-white transition-all",
                      selectedCountry.code === country.code && "bg-white/5 text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={country.flag} 
                        alt={country.name}
                        className="w-5 h-3.5 object-cover shadow-sm"
                      />
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] font-bold leading-tight">{country.name}</span>
                        <span className="text-[9px] text-zinc-500 font-medium">{country.prefix}</span>
                      </div>
                    </div>
                    {selectedCountry.code === country.code && (
                      <Check className="size-3 text-indigo-400 stroke-[3px]" />
                    )}
                  </button>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex items-center flex-1 px-4 relative">
          <span className="text-sm font-bold text-zinc-500 mr-2 shrink-0">{selectedCountry.prefix}</span>
          <input
            {...props}
            ref={ref}
            type="tel"
            value={localNumber}
            onChange={handleNumberChange}
            placeholder="099 123 4567"
            className="w-full bg-transparent border-none p-0 text-sm font-bold text-white placeholder:text-zinc-600 focus:outline-none"
          />
        </div>
      </div>
    )
  }
)

PhoneInput.displayName = "PhoneInput"
