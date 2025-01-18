import { clientEnvs } from "@/env/client";
import { Stripe, loadStripe } from "@stripe/stripe-js";

const STRIPE_PUBLISHABLE_KEY = clientEnvs.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
	if (!stripePromise) {
		stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
	}
	return stripePromise;
};

export default getStripe;
