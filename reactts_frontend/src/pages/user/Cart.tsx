import { siteConfig } from "../../config/siteConfig"

export default function Cart() {
    const colors = siteConfig.colors;

    return(
        <div>
            <h1
            className="text-2xl"
            style={{color: colors.primarycolor}}>Cart</h1>
        </div>
    )
}