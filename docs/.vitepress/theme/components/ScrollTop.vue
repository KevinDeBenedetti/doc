<script setup lang="ts">
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
</script>

<template>
  <button class="button" @click="scrollToTop">
    <p class="button__text">
      <span style="--index: 0;">S</span>
      <span style="--index: 1;">C</span>
      <span style="--index: 2;">R</span>
      <span style="--index: 3;">O</span>
      <span style="--index: 4;">L</span>
      <span style="--index: 5;">L</span>
      <span style="--index: 6;"> </span>
      <span style="--index: 7;">T</span>
      <span style="--index: 8;">O</span>
      <span style="--index: 9;"> </span>
      <span style="--index: 10;">T</span>
      <span style="--index: 11;">O</span>
      <span style="--index: 12;">P</span>
    </p>

    <div class="button__circle">
      <svg
        viewBox="0 0 14 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="button__icon"
        width="14"
      >
        <path
          d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
          fill="currentColor"
        ></path>
      </svg>

      <svg
        viewBox="0 0 14 15"
        fill="none"
        width="14"
        xmlns="http://www.w3.org/2000/svg"
        class="button__icon button__icon--copy"
      >
        <path
          d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
          fill="currentColor"
        ></path>
      </svg>
    </div>
  </button>
</template>

<style scoped>
.button {
  cursor: pointer;
  border: none;
  background: var(--vp-button-brand-bg);
  color: white;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  overflow: hidden;
  position: fixed;
  z-index: 100;
  bottom: 1rem;
  right: 1rem;
  display: grid;
  place-content: center;
  transition:
    background 300ms,
    transform 200ms;
  font-weight: 600;
  opacity: 0.6;
}

.button__text {
  font-size: 6px;
  position: absolute;
  inset: 0;
  animation: text-rotation 8s linear infinite reverse;

  > span {
    position: absolute;
    transform: rotate(calc(19deg * var(--index)));
    inset: -7px;
  }
}

.button__icon {
  transform: rotate(-45deg);
}

.button__circle {
  position: relative;
  width: 35px;
  height: 35px;
  overflow: hidden;
  background: white;
  color: var(--vp-button-brand-bg);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button__icon--copy {
  position: absolute;
  transform: rotate(-45deg) translate(-150%, 150%);
}

.button:hover {
  background: white;
  transform: scale(1.05);
}

.button:hover .button__icon {
  color: white;
}

.button:hover .button__text {
  color: var(--vp-button-brand-bg);
}

.button:hover .button__circle {
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-hover-text);
}

.button:hover .button__icon:first-child {
  transition: transform 0.3s ease-in-out;
  transform: rotate(-45deg) translate(150%, -150%);
}

.button:hover .button__icon--copy {
  transition: transform 0.3s ease-in-out 0.1s;
  transform: rotate(-45deg) translate(0);
}

@keyframes text-rotation {
  to {
    rotate: 360deg;
  }
}
</style>