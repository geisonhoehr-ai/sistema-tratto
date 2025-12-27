export interface Tenant {
    id: string
    name: string
    fullName: string
    logo: string
    primaryColor: string
    secondaryColor: string
    description: string
    // Branding customization
    customLogo?: string // URL or base64 for uploaded logo
    customPrimaryColor?: string // Custom primary color
    customSecondaryColor?: string // Custom secondary color
    customDomain?: string // Custom domain like "belezapura.beautyflow.app"
}

export const tenants: Tenant[] = [
    {
        id: '1',
        name: 'Beleza Pura',
        fullName: 'Salão Beleza Pura',
        logo: '💎',
        primaryColor: '#8B5CF6', // Purple
        secondaryColor: '#A78BFA',
        description: 'Especializado em tratamentos capilares premium',
        customPrimaryColor: '#8B5CF6',
        customSecondaryColor: '#A78BFA',
        customDomain: 'belezapura.beautyflow.app'
    },
    {
        id: '2',
        name: 'Studio Glamour',
        fullName: 'Studio Glamour Beauty',
        logo: '✨',
        primaryColor: '#EC4899', // Pink
        secondaryColor: '#F472B6',
        description: 'Seu destino para beleza e bem-estar',
        customPrimaryColor: '#EC4899',
        customSecondaryColor: '#F472B6',
        customDomain: 'studioglamour.beautyflow.app'
    },
    {
        id: '3',
        name: 'Espaço Elegance',
        fullName: 'Espaço Elegance Spa',
        logo: '🌸',
        primaryColor: '#06B6D4', // Cyan
        secondaryColor: '#22D3EE',
        description: 'Experiência completa de spa e estética',
        customPrimaryColor: '#06B6D4',
        customSecondaryColor: '#22D3EE',
        customDomain: 'elegance.beautyflow.app'
    }
]

