import { Payment } from "@/screens/payment";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Payment page",
    description: "Esim4U Payment Page",
};

const PaymentPage = ({ params }: { params: { order_id: string } }) => {
    return <Payment params={params} />;
};

export default PaymentPage;
