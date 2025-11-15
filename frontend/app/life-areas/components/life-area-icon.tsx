// import {
//   Briefcase,
//   ChevronsUpDown,
//   Coins,
//   Gamepad2,
//   Heart,
//   HeartPulse,
//   Home,
//   Landmark,
//   Mountain,
//   Sparkles,
//   Star,
//   Users,
//   Users2,
//   X,
// } from 'lucide-react';

// const lifeAeaIconMap = {
//   'chevrons-up-down': ChevronsUpDown,
//   star: Star,
//   x: X,
//   users: Users,
//   landmark: Landmark,
//   sparkles: Sparkles,
//   'gamepad-2': Gamepad2,
//   home: Home,
//   'users-2': Users2,
//   coins: Coins,
//   heart: Heart,
//   mountain: Mountain,
//   briefcase: Briefcase,
//   'heart-pulse': HeartPulse,
// } as const;

// type LifeAeaIconMap = keyof typeof lifeAeaIconMap;

// // Define proper type for React icon component
// type IconComponent = React.ComponentType<{ className?: string }>;

// interface LifeAreaIconProps {
//   iconName?: string;
//   className?: string;
//   fallbackIcon?: IconComponent;
// }

// export function LifeAreaIcon({ iconName, className, fallbackIcon: FallbackIcon = X }: LifeAreaIconProps) {
//   if (!iconName) return <FallbackIcon className={className} />;

//   const IconComponent = lifeAeaIconMap[iconName as LifeAeaIconMap] || FallbackIcon;
//   return <IconComponent className={className} />;
// }

// // Export the icon map for external use if needed
// export { lifeAeaIconMap, type LifeAeaIconMap };
