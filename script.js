document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loading-screen");
  const bgMusic = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-btn');
  const musicIcon = document.getElementById('music-icon');
  
  const playPath = "M5 3v18l15-9L5 3z"; // Play icon
  const pausePath = "M6 19h4V5H6v14zm8-14v14h4V5h-4z"; // Pause icon

  let isPlaying = false;
  if (bgMusic) bgMusic.volume = 0.3;

  const playMusic = () => {
    if (bgMusic) {
      bgMusic.play().then(() => {
        isPlaying = true;
        if (musicIcon) musicIcon.querySelector('path').setAttribute('d', pausePath);
      }).catch((e) => {
        console.log("Autoplay prevented by browser, waiting for user interaction.", e);
      });
    }
  };

  // 1. Loading Screen "Click to Enter"
  if (loadingScreen) {
    loadingScreen.addEventListener('click', () => {
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 800);
      
      // Play music immediately on this first interaction
      playMusic();
    });
  }

  // Attempt native autoplay removed to ensure music only starts on click


  if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent document click from firing immediately
      if (isPlaying) {
        bgMusic.pause();
        if (musicIcon) musicIcon.querySelector('path').setAttribute('d', playPath);
      } else {
        playMusic();
      }
      isPlaying = !bgMusic.paused;
    });
  }

  // Volume Slider Logic
  const volumeSlider = document.getElementById('volume-slider');
  if (volumeSlider && bgMusic) {
    const updateSliderBackground = (val) => {
      const percentage = val * 100;
      volumeSlider.style.background = `linear-gradient(to right, #18181b ${percentage}%, #e4e4e7 ${percentage}%)`;
    };
    
    // Set initial state
    volumeSlider.value = bgMusic.volume;
    updateSliderBackground(bgMusic.volume);

    volumeSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      bgMusic.volume = val;
      updateSliderBackground(val);
      
      // Unmute and play if user interacts with volume
      if (!isPlaying || bgMusic.paused) {
         playMusic();
      }
    });
  }

  // 1.3 Gooey Text Morphing Logic
  const texts = ["Design", "Engineering", "Is", "Awesome"];
  const morphTime = 1;
  const cooldownTime = 0.5;

  const text1 = document.getElementById("text1");
  const text2 = document.getElementById("text2");

  if (text1 && text2) {
    let textIndex = texts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;

    text1.textContent = texts[textIndex % texts.length];
    text2.textContent = texts[(textIndex + 1) % texts.length];

    function setMorph(fraction) {
      text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      let invFraction = 1 - fraction;
      text1.style.filter = `blur(${Math.min(8 / invFraction - 8, 100)}px)`;
      text1.style.opacity = `${Math.pow(invFraction, 0.4) * 100}%`;
    }

    function doCooldown() {
      morph = 0;
      text2.style.filter = "";
      text2.style.opacity = "100%";
      text1.style.filter = "";
      text1.style.opacity = "0%";
    }

    function doMorph() {
      morph -= cooldown;
      cooldown = 0;
      let fraction = morph / morphTime;

      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }

      setMorph(fraction);
    }

    function animateGooey() {
      requestAnimationFrame(animateGooey);
      const newTime = new Date();
      const shouldIncrementIndex = cooldown > 0;
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;

      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex = (textIndex + 1) % texts.length;
          text1.textContent = texts[textIndex % texts.length];
          text2.textContent = texts[(textIndex + 1) % texts.length];
        }
        doMorph();
      } else {
        doCooldown();
      }
    }

    animateGooey();
  }

  // 1.5 Custom Cursor Logic
  const cursor = document.getElementById('custom-cursor');
  if (cursor && window.innerWidth >= 768) {
    // Smooth follow using GSAP quickTo
    const xTo = gsap.quickTo(cursor, "left", {duration: 0.2, ease: "power3"});
    const yTo = gsap.quickTo(cursor, "top", {duration: 0.2, ease: "power3"});

    window.addEventListener("mousemove", (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });

    // Hover effect for links and buttons
    const interactiveElements = document.querySelectorAll('a, button, input, select, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '50px';
        cursor.style.height = '50px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
      });
    });
  }

  // 2. Register GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // 4. Hero Animations
  gsap.to(".developer-text-black", {
    opacity: 1,
    duration: 1.5,
    delay: 1,
    ease: "power2.out"
  });
  gsap.to(".developer-text-white", {
    opacity: 1,
    duration: 1.5,
    delay: 1,
    ease: "power2.out"
  });

  // 4.5 Manifesto Text Reveal
  const manifestoText = document.getElementById('manifesto-text');
  if (manifestoText) {
    // Use textContent and normalize spaces to avoid weird line breaks
    const text = manifestoText.textContent.trim().replace(/\s+/g, ' ');
    manifestoText.innerHTML = "";
    
    const words = text.split(" ");
    words.forEach((word, index) => {
      // Wrap each word to prevent line breaks in the middle of a word
      const wordSpan = document.createElement("span");
      wordSpan.style.whiteSpace = "nowrap";
      
      const chars = word.split("");
      chars.forEach(char => {
        const span = document.createElement("span");
        span.innerText = char;
        span.style.color = "#d4d4d8"; // tailwind text-zinc-300
        
        // Stretch the letters vertically
        span.style.display = "inline-block";
        span.style.transform = "scaleY(1.35)";
        span.style.transformOrigin = "bottom";
        
        wordSpan.appendChild(span);
      });
      
      manifestoText.appendChild(wordSpan);
      
      // Add a space text node between words
      if (index < words.length - 1) {
        manifestoText.appendChild(document.createTextNode(" "));
      }
    });

    // Select the letter spans (not the word spans)
    const spans = manifestoText.querySelectorAll("span > span");
    
    // Set initial state
    gsap.set(spans, { color: "#d4d4d8" });
    
    // Animate color smoothly with a stagger and scrub inertia
    gsap.to(spans, {
      color: "#18181b",
      stagger: 0.02, // Smaller stagger since there are many letters
      scrollTrigger: {
        trigger: "#about",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5, // 1.5 seconds of smoothing "butter" inertia
      }
    });
  }

  // 5. Portfolio Section (Zarcerog Style - Horizontal Scroll)
  const pinWrapper = document.getElementById('portfolio-pin-wrapper');
  const projectsContainer = document.getElementById('projects-container');
  const projectPanels = document.querySelectorAll('.project-panel');
  
  if (pinWrapper && projectsContainer && projectPanels.length > 0) {
    // Calculate total horizontal scroll distance
    const getScrollAmount = () => -(projectsContainer.scrollWidth - window.innerWidth);

    const tween = gsap.to(projectsContainer, {
      x: getScrollAmount,
      ease: "none"
    });

    ScrollTrigger.create({
      trigger: pinWrapper,
      start: "top top",
      end: () => `+=${projectsContainer.scrollWidth - window.innerWidth}`,
      pin: true,
      animation: tween,
      scrub: 1,
      invalidateOnRefresh: true
    });
    
    // Add subtle parallax to titles horizontally using containerAnimation
    projectPanels.forEach((panel) => {
      const title = panel.querySelector('.project-title');
      if (title) {
        gsap.to(title, {
          x: 150, // Slight horizontal drift
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            containerAnimation: tween,
            start: "left right",
            end: "right left",
            scrub: true
          }
        });
      }
    });
  }

  // 6. Services Overlapping Cards
  const servicesContainer = document.querySelector('#services');
  const serviceCards = document.querySelectorAll('.service-card');
  
  if (servicesContainer && serviceCards.length > 0) {
    // The section is already pinned by CSS `sticky` and `height: 400vh` in index.html.
    // We just animate the cards based on scroll progress.

    serviceCards.forEach((card, index) => {
      if (index === 0) return;
      
      // Initially hide subsequent cards below viewport
      gsap.set(card, { y: window.innerHeight });
      
      // Calculate a stacking offset based on a fixed height (e.g., 100px per header)
      const stackOffset = index * 110; // roughly the height of the title area

      gsap.to(card, {
        y: stackOffset,
        ease: "none",
        scrollTrigger: {
          trigger: servicesContainer,
          start: () => `top+=${(index - 1) * window.innerHeight} top`,
          end: () => `+=${window.innerHeight}`,
          scrub: true,
        }
      });
    });
  }

  // 7. Jack of All Trades Parallax
  const jackSection = document.querySelector('.jack-section');
  const jackTexts = document.querySelectorAll('.jack-text-container > div');
  const scatterContainer = document.querySelector('.jack-scatter-container');
  
  if (jackSection && jackTexts.length > 0) {
    const jackTl = gsap.timeline({
      scrollTrigger: {
        trigger: jackSection,
        start: "top 20%",
        end: "+=100%", // Animates over 100vh of scrolling
        scrub: 1, // Smooth scrolling in both directions
      }
    });

    // Reveal texts one by one
    jackTl.to(jackTexts, {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      ease: "power2.out"
    });

    // Fade in scatter images and float them up slightly
    jackTl.to(scatterContainer, {
      opacity: 1,
      y: -20,
      ease: "power1.out"
    }, "<0.2"); // Starts slightly after the text starts
  }

  // 8. Tech Stack Duality Animation (Zarcerog Style)
  const techSection = document.querySelector('.tech-stack-section');
  const techLeft = document.querySelector('.tech-left-col');
  const techRight = document.querySelector('.tech-right-col');
  const techDivider = document.querySelector('.tech-divider');

  if (techSection && techLeft && techRight) {
    // We pin the tech section and scrub the inner columns in opposite directions
    const techTl = gsap.timeline({
      scrollTrigger: {
        trigger: techSection,
        start: "top top",
        end: "+=200%", // Pins for 2x viewport height to give plenty of scroll room
        pin: true,
        scrub: 1, // Smooth scrolling
      }
    });

    // 1. Divider line grows from top to bottom
    if (techDivider) {
      techTl.to(techDivider, {
        scaleY: 1,
        ease: "none"
      }, 0);
    }

    // 2. Left column (Heading) starts high and moves significantly down
    gsap.set(techLeft, { y: "-30vh" });
    techTl.to(techLeft, {
      y: "30vh",
      ease: "none"
    }, 0);

    // 3. Right column (Tech List) starts low and moves significantly up
    gsap.set(techRight, { y: "60vh" });
    techTl.to(techRight, {
      y: "-60vh",
      ease: "none"
    }, 0);
  }

  // 9. Typewriter Effect
  const typewriterText = document.getElementById('typewriter-text');
  if (typewriterText) {
    const phrases = ["LET'S MAKE DESIGN", "YOU WANT TO CLICK"];
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    
    function typeLoop() {
      const currentPhrase = phrases[currentPhraseIndex];
      
      if (isDeleting) {
        // Remove a character
        typewriterText.textContent = currentPhrase.substring(0, currentCharIndex - 1);
        currentCharIndex--;
      } else {
        // Add a character
        typewriterText.textContent = currentPhrase.substring(0, currentCharIndex + 1);
        currentCharIndex++;
      }
      
      // Default typing speed
      let typeSpeed = 100;
      
      if (isDeleting) {
        typeSpeed /= 2; // Delete faster
      }
      
      // If word is complete
      if (!isDeleting && currentCharIndex === currentPhrase.length) {
        // Pause at the end of the word
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        // Move to next phrase
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        // Pause before typing next word
        typeSpeed = 500;
      }
      
      setTimeout(typeLoop, typeSpeed);
    }
    
    // Start the loop
    setTimeout(typeLoop, 1000);
  }

  // 9. Live Local Time
  const timeElement = document.getElementById('local-time');
  if (timeElement) {
    function updateTime() {
      const now = new Date();
      // Format: hh:mm:ss AM/PM
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      timeElement.textContent = timeString;
    }
    
    // Update immediately, then every second
    updateTime();
    setInterval(updateTime, 1000);
  }

});
