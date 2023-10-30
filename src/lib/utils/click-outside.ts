/** Dispatch event on click outside of designated elements */
export function clickOutside(node: HTMLElement) {
    console.log("YO got called", node);
    const handleClick = (event: MouseEvent) => {
        console.log("clickOutside", event.target)
        // Check if the event target has the designated class or attribute
        const isTargetInteractive =
            (event.target as HTMLElement).closest(".interactive-element") ||
            (event.target as HTMLElement).hasAttribute("data-interactive");

        if (
            !isTargetInteractive &&
            !node.contains(event.target as Node) &&
            !event.defaultPrevented
        ) {
            node.dispatchEvent(new CustomEvent('clickOutside', { detail: { node } }));
        }
    };

    document.addEventListener("click", handleClick, true);

    return {
        destroy() {
            document.removeEventListener("click", handleClick, true);
        },
    };
}
