import Devices from "@/screens/package/devices";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Compatible Devices",
    description: "page that shows devices that suppors esims",
};

const CompatibleDevicesPage = () => {
    return <Devices />;
};

export default CompatibleDevicesPage;
