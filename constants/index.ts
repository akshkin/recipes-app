import {
	Bone,
	Drumstick,
	Fish,
	HeartPulse,
	Leaf,
	LeafyGreen,
	LucideIcon,
	MilkOff,
	NutOff,
	Salad,
	WheatOff,
} from "lucide-react";

export const CATEGORIES = [
	{
		title: "breakfast",
		value: "breakfast",
		image: "/assets/icons/breakfast.svg",
	},

	{
		title: "meals",
		value: "meals",
		image: "/assets/icons/spaghetti.svg",
	},
	{
		title: "dessert",
		value: "dessert",
		image: "/assets/icons/cupcake.svg",
	},
	{
		title: "snacks",
		value: "snacks",
		image: "/assets/icons/popcorn.svg",
	},
];

export const CUISINES = [
	{ title: "american", value: "american", icon: "🍔" },
	{ title: "mexican", value: "mexican", icon: "🌮" },
	{ title: "asian", value: "asian", icon: "🍜" },
	{ title: "indian", value: "indian", icon: "🍛" },
	{ title: "thai", value: "thai", icon: "🍲" },
	{ title: "chinese", value: "chinese", icon: "🥡" },
	{ title: "japanese", value: "japanese", icon: "🍣" },
	{ title: "french", value: "french", icon: "🥐" },
	{ title: "italian", value: "italian", icon: "🍝" },
	{ title: "greek", value: "greek", icon: "🫒" },
	{ title: "spanish", value: "spanish", icon: "🥘" },
	{ title: "mediterranean", value: "mediterranean", icon: "🥗" },
	{ title: "lebanese", value: "lebanese", icon: "🧆" },
	{ title: "moroccan", value: "moroccan", icon: "🍲" },
	{ title: "turkish", value: "turkish", icon: "🥙" },
	{ title: "caribbean", value: "caribbean", icon: "🏝️" },
	{ title: "german", value: "german", icon: "🥨" },
	{ title: "russian", value: "russian", icon: "🥟" },
	{ title: "hungarian", value: "hungarian", icon: "🍲" },
];

export const FILTERS = [
	{ title: "Newest", value: "newest" },
	{ title: "Oldest", value: "oldest" },
	{ title: "Name A-Z", value: "name_asc" },
	{ title: "Name Z-A", value: "name_desc" },
	{ title: "Highest rated", value: "rating_desc" },
	{ title: "Lowest rated", value: "rating_asc" },
];

export const RECIPETIME = [
	{ title: "Under 30 minutes", value: 30 },
	{ title: "30 - 60 minutes", value: 60 },
];

export const dietaryTagsConst: Record<
	string,
	{ icon: LucideIcon; color: string }
> = {
	Vegetarian: {
		icon: LeafyGreen,
		color: "text-green-600",
	},

	Vegan: {
		icon: Leaf,
		color: "text-emerald-600",
	},

	"Gluten-Free": {
		icon: WheatOff,
		color: "text-yellow-600",
	},

	Pescatarian: {
		icon: Fish,
		color: "text-blue-500",
	},

	Keto: {
		icon: Drumstick,
		color: "text-orange-500",
	},

	Paleo: {
		icon: Bone,
		color: "text-orange-500",
	},

	"Low-Carb": {
		icon: Salad,
		color: "text-orange-500",
	},
	"Low-Fat": {
		icon: HeartPulse,
		color: "text-orange-500",
	},

	"Nut-Free": {
		icon: NutOff,
		color: "text-orange-500",
	},

	"Dairy-Free": {
		icon: MilkOff,
		color: "text-white",
	},
} as const;
