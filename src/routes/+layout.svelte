<script>
    import '../app.css'
    import { onMount } from 'svelte';

    let m = { x: 0, y: 0 };
	function handleCursor(event) {
		m.x = event.clientX;
		m.y = event.clientY;
	}

    onMount(() => {
        let circle = document.getElementById('cursor');
        const onMouseMove = (e) =>{
            circle.style.left = e.pageX + 'px';
            circle.style.top = e.pageY + 'px';
        }
        document.addEventListener('mousemove', onMouseMove);
    });
</script>
<nav>
	<a href="/">Home</a>
	<a href="/photos">Photos</a>
    <a href="/about">About</a>
</nav>

<div id="cursor">{m.x} x {m.y}</div>
<main on:mousemove={handleCursor}>
    <slot />
</main>

<style>
    nav {
        display: flex;
        justify-content: space-between;
    }

    .content {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    #cursor {
        position: absolute;
        transform:translate(10%,-50%);
        height:35px;
        width:35px;
        font-size: 1rem;
        border:2px solid black;
    }
</style>