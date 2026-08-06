import {
	Bone,
	Drumstick,
	Fish,
	HeartPulse,
	Leaf,
	LeafyGreen,
	MilkOff,
	NutOff,
	Salad,
	WheatOff,
} from "lucide-react";

const bucketUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const publicImageUrl = `${bucketUrl}/storage/v1/object/public/recipe`;

export const dietaryTagsConst: Record<string, { icon: any; color: string }> = {
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
};
