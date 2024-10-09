<div x-data="zigzag()" class="relative w-screen h-screen overflow-hidden">
    <button @click="toggleMovement()" class="absolute relative w-screen h-screen overflow-hidden">
        <img 
            :src="currentImage" 
            alt="Button Face" 
            class="ml-3 w-28 h-auto transform transition-transform duration-500 ease-linear"
            :style="'transform: translate(' + x + 'px, ' + y + 'px)'"
        >
    </button>
</div>