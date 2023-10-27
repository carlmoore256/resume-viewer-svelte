<script lang="ts">
    import { draw } from "svelte/transition";
    export let position: { x: number; y: number };
    export let size: number;
    export let color: string;
    export let opacity: number = 0.5;
    export let dashed: boolean = false;
    export let drawDurationMs: number = 500;
</script>

<div
    id="indicator"
    style={`
        top: ${position.y - size}px; 
        left: ${position.x - size}px;
        width: ${size * 2}px;
        height: ${size * 2}px;
        `}
>
    <svg>
        <path
            d={`M ${size},${size - size * 0.8} a ${size * 0.8},${
                size * 0.8
            } 0 1,0 0,${size * 0.8 * 2} a ${size * 0.8},${
                size * 0.8
            } 0 1,0 0,-${size * 0.8 * 2}`}
            {opacity}
            stroke={color}
            stroke-width="4"
            stroke-dasharray={dashed ? "3,3" : "none"}
            fill="none"
            in:draw={{ duration: drawDurationMs }}
            out:draw={{ duration: drawDurationMs }}
        />
    </svg>
</div>

<style>
    #indicator {
        position: absolute;
    }
</style>
