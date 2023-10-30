<script lang="ts">
    // import ExperienceModal from './ExperienceModal.svelte';
    // import SkillModal from './SkillModal.svelte';
    // import DescriptionModal from './DescriptionModal.svelte';

    export let position: { x: number; y: number } | null = null;

    let activeTab = "experience"; // default tab
</script>

{#if position}
    <div class="modal" style={`top: ${position.y}; left: ${position.x}`}>
        <div class="tabs">
            <button
                on:click={() => (activeTab = "experience")}
                class:selected={activeTab === "experience"}>Experience</button
            >
            <button
                on:click={() => (activeTab = "skill")}
                class:selected={activeTab === "skill"}>Skill</button
            >
            <button
                on:click={() => (activeTab = "description")}
                class:selected={activeTab === "description"}>Description</button
            >
        </div>

        {#if activeTab === "experience"}
            <!-- <ExperienceModal /> -->
        {/if}

        {#if activeTab === "skill"}
            <!-- <SkillModal /> -->
        {/if}

        {#if activeTab === "description"}
            <!-- <DescriptionModal /> -->
        {/if}
    </div>
{/if}

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 300px;
        height: 300px;
        background-color: rgba(0, 0, 0, 0.6); /* Semi-transparent black */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000; /* Ensure modal is on top */
    }

    .modal {
        width: 60%; /* Adjust to your preference */
        max-width: 600px;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2); /* A subtle shadow */
        padding: 20px;
        position: relative;
        z-index: 1001; /* Ensure modal content is on top of overlay */
    }

    .tabs {
        display: flex;
        justify-content: space-between;
        border-bottom: 2px solid #eee; /* A subtle line under tabs for separation */
        margin-bottom: 20px; /* Spacing below the tabs */
    }

    .tabs button {
        padding: 10px 20px;
        background-color: #f5f5f5; /* Neutral color */
        border: none;
        border-radius: 5px 5px 0 0; /* Rounded corners only on top */
        cursor: pointer;
        transition: background-color 0.2s ease;
        flex: 1; /* Distribute space evenly among the tabs */
        text-align: center; /* Center the tab labels */
    }

    .tabs button.selected {
        background-color: #007bff; /* Highlight color */
        color: #ffffff; /* White text for contrast */
    }

    .tabs button:not(.selected):hover {
        background-color: #e0e0e0; /* Slightly darker on hover for non-selected tabs */
    }
</style>
