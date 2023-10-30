<script lang="ts">
    import type { Contact } from "../lib/api";
    import { formatPhoneNumber } from "../lib/format";
    import Icon from "@iconify/svelte";
    export let subject: Contact;

    // idea - on subject header click, it expands to show the map
</script>

<div
    id="container"
    class="p-5 my-4 rounded-lg flex gap-10 border-solid border border-slate-400 transition-all duration-300 hover:py-8"
>
    <div class="flex flex-col gap-2 m-2">
        <h1 class="text-3xl font-bold">{subject.firstName} {subject.lastName}</h1>
        <h3 class="text-xl font-light">{subject.title}</h3>
    </div>
    <div class="flex flex-col gap-1 font-light m-2 text-sm">
        {#if subject.email}
            <div class="flex items-center gap-2">
                <Icon icon="ic:baseline-email" />
                <a
                    href="mailto:{subject.email}"
                    class="transition-colors hover:text-blue-600"
                    >{subject.email}</a
                >
            </div>
        {/if}
        {#if subject.phone}
            <div class="flex items-center gap-2">
                <Icon icon="ic:baseline-phone" />
                <span>{formatPhoneNumber(subject.phone)}</span>
            </div>
        {/if}
        {#if subject.github}
            <div class="flex items-center gap-2">
                <Icon icon="akar-icons:github-fill" />
                <a
                    href="https://github.com/{subject.github}"
                    target="_blank"
                    class="transition-colors hover:text-blue-600"
                    >{subject.github}</a
                >
            </div>
        {/if}
        {#if subject.linkedin}
            <div class="flex items-center gap-2">
                <Icon icon="material-symbols:work" />
                <span
                    >LinkedIn: <a
                        href="https://www.linkedin.com/in/{subject.linkedin}"
                        target="_blank"
                        class="transition-colors hover:text-blue-600"
                        >{subject.linkedin}</a
                    ></span
                >
            </div>
        {/if}
        {#if subject.website}
            <div class="flex items-center gap-2">
                <Icon icon="material-symbols:web" />
                <span
                    >Website: <a
                        href={subject.website}
                        target="_blank"
                        class="transition-colors hover:text-blue-600"
                        >{subject.website}</a
                    ></span
                >
            </div>
        {/if}
    </div>
</div>

<style>
    #container {
        background: linear-gradient(
            120deg,
            rgba(45, 41, 115, 0.15) 0%,
            rgba(55, 55, 155, 0.15) 34%,
            rgba(88, 202, 107, 0.15) 100%
        );
    }

    @media (max-width: 400px) {
        #container {
            flex-direction: column;
            align-items: center;
        }
    }


</style>
