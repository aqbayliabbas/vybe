import Image from 'next/image';

interface VybeLogoProps {
  className?: string;
  variant?: 'default' | 'white';
}

export function VybeLogo({ className = '', variant = 'default' }: VybeLogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image 
        src={variant === 'white' ? "/logo-white.svg" : "/logo.svg"} 
        alt="Vybe Logo" 
        width={100} 
        height={44} 
        priority
        className="object-contain"
      />
    </div>
  );
}
