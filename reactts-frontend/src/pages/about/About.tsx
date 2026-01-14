import { siteConfig } from "../../config/siteConfig";

export default function About() {
    const colors = siteConfig.colors;
    return (
        <div className="flex flex-col items-center m-6">
            <h1
            className="text-4xl font-bold"
            style={{color: colors.primarycolor}}>
                About us
            </h1>

            <p className="text-2xl m-6">
                Engineer: Mr. Qui
                <br />
                Email: voquangqui176@gmail.com
                <br />
                Contact: 0798259608
                <br />
                Address: Thoai Ngoc Hau street, Phu Thanh Ward, Ho Chi Minh city
            </p>
        </div>
    )
}
