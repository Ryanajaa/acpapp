import NavigationLayout from "./NavigationBar";

export default function Layout({ children }) {
    return (
        <NavigationLayout>
            <main>{children}</main>
        </NavigationLayout>
    )
}