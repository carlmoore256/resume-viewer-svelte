<script lang="ts">
    import type { Contact } from "../lib/resume-types";
    import { formatPhoneNumber } from "../lib/format";
    import Icon from "@iconify/svelte";
    export let subject: Contact;
</script>

<div id="container">
    <div class="name-title">
        <h1>{subject.name}</h1>
        <h3>{subject.title}</h3>
    </div>
    <div class="contact-info">
        {#if subject.email}
            <div class="contact-item">
                <Icon icon="ic:baseline-email" />
                <a href="mailto:{subject.email}">{subject.email}</a>
            </div>
        {/if}
        {#if subject.phone}
            <div class="contact-item">
                <Icon icon="ic:baseline-phone" />
                <span>{formatPhoneNumber(subject.phone)}</span>
            </div>
        {/if}
        {#if subject.github}
            <div class="contact-item">
                <Icon icon="akar-icons:github-fill" />
                <a href="https://github.com/{subject.github}" target="_blank"
                    >{subject.github}</a
                >
            </div>
        {/if}
        {#if subject.linkedin}
            <div class="contact-item">
                <Icon icon="material-symbols:work" />
                <span
                    >LinkedIn: <a
                        href="https://www.linkedin.com/in/{subject.linkedin}"
                        target="_blank">{subject.linkedin}</a
                    ></span
                >
            </div>
        {/if}
        {#if subject.website}
            <div class="contact-item">
                <Icon icon="material-symbols:web" />
                <span
                    >Website: <a href={subject.website} target="_blank"
                        >{subject.website}</a
                    ></span
                >
            </div>
        {/if}
    </div>
</div>

<style>
    #container {
        /* background-color: rgba(240, 248, 255, 0.085); */
        background: rgb(2, 0, 36);
        background: linear-gradient(
            120deg,
            rgba(45, 41, 115, 0.15) 0%,
            rgba(55, 55, 155, 0.15) 34%,
            rgba(94, 56, 121, 0.15) 100%
        );
        padding: 10px 20px;
        display: flex;
        gap: 40px;
        border-radius: 8px;
    }

    h1, h3 {
        margin: 0; /* Remove default margins */
    }

    @media (max-width: 400px) {
        #container {
            flex-direction: column;
            align-items: center;
        }
    }

    .name-title {
        display: flex;
        flex-direction: column;
        align-items: left;
        gap: 0.5rem;
    }

    .contact-info {
        display: flex;
        flex-direction: column;
        align-items: left;
        gap: 0.3rem;
        
    }

    .contact-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .contact-item a {
        text-decoration: none;
        color: inherit;
        transition: color 0.3s ease;
    }

    .contact-item a:hover {
        color: #0077cc;
    }
</style>
