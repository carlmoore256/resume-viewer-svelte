<script lang="ts">
    import type { Experience } from "../lib/api-types";
    import DataCreator from "./DataCreator.svelte";
</script>

<DataCreator>
    <h3>Add Experience</h3>
    <!-- prevent default of form -->
    <form>
        <div class="form-item">
            <label for="exp-title">Experience Name</label>
            <input id="exp-title" />
        </div>

        <input type="submit" value="Submit" />
    </form>
</DataCreator>

<style>
    * {
        margin: 0;
        font-family: sans-serif;
    }

    .form-item {
        display: flex;
        flex-direction: column;
        font-size: 12px;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
</style>
