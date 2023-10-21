<script lang="ts">
    import { getDescriptions } from "../lib/api";

    let canvas: any;

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    function drawCircle(ctx: any, x: number, y: number, label: string) {
        ctx.beginPath();
        ctx.arc(x, y, 50, 0, Math.PI * 2);
        ctx.fillStyle = "#AEDFF7";
        ctx.fill();
        ctx.stroke();

        // Drawing text inside the circle
        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, x, y, 90); // 90 is the max width to ensure text doesn't overflow the circle
    }

    function getNormalizationFactors(data: any) {
        let minX = Infinity,
            maxX = -Infinity,
            minY = Infinity,
            maxY = -Infinity;

        data.forEach((item: any) => {
            const [x, y] = item.reducedEmbedding;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        });

        return {
            offsetX: -minX,
            scaleX: canvasWidth / (maxX - minX),
            offsetY: -minY,
            scaleY: canvasHeight / (maxY - minY),
        };
    }
    // Function to render circles on canvas
    function updateCanvas(canvas: any, data: any) {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        const { offsetX, scaleX, offsetY, scaleY } =
            getNormalizationFactors(data);

        data.forEach((item: any) => {
            // Here I'm normalizing the reducedEmbedding values to fit within the canvas dimensions
            const x = (item.reducedEmbedding[0] + offsetX) * scaleX;
            const y = (item.reducedEmbedding[1] + offsetY) * scaleY;
            drawCircle(ctx, x, y, item.text);
        });
    }

    // $: updateCanvas($canvas, data);

    let descriptionData: any;

    $: if (canvas) {
        getDescriptions().then((data) => {
            descriptionData = data;
            updateCanvas(canvas, data);
        });

        window.addEventListener("resize", () => {
            if (descriptionData) {
                updateCanvas(canvas, descriptionData);
            }
        });
    }
</script>

<canvas bind:this={canvas} width={canvasWidth} height={canvasHeight} />

<style>
    canvas {
        display: block;
        position: absolute;
        /* background-color: #f3f4f6; */
    }
</style>
