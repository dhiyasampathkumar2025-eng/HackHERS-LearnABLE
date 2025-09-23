// --- Minimized Profile Dropdown Logic ---
// Flask/Django can inject these variables:
window.userName = window.userName || "Guest";
window.userPoints = window.userPoints || 120;
window.userBadge = window.userBadge || "Gold";
window.profilePicUrl = window.profilePicUrl || "https://via.placeholder.com/40";

function insertProfileData() {
    document.getElementById('username').textContent = window.userName;
    document.getElementById('points').textContent = window.userPoints;
    document.getElementById('badge').textContent = window.userBadge;
    document.getElementById('profilePic').src = window.profilePicUrl;
}

function setupProfileDropdown() {
    const profile = document.getElementById('profileContainer');
    const dropdown = document.getElementById('dropdownMenu');
    const signOut = document.getElementById('signOut');
    let open = false;

    function toggleDropdown(e) {
        e.stopPropagation();
        open = !open;
        dropdown.classList.toggle('active', open);
    }

    function closeDropdown() {
        open = false;
        dropdown.classList.remove('active');
    }

    profile.addEventListener('click', toggleDropdown);
    document.addEventListener('click', function(e) {
        if (open && !profile.contains(e.target)) closeDropdown();
    });
    signOut.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Sign out clicked (connect to backend /logout)');
        closeDropdown();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    insertProfileData();
    setupProfileDropdown();
});
// --- Feedback Modal, Voice-to-Text, and Submission Logic ---
let recognition = null;
let recognizing = false;

function openFeedbackModal() {
    document.getElementById('feedbackOverlay').classList.add('active');
    const modal = document.getElementById('feedbackModal');
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.getElementById('feedbackText').focus();
}

function closeFeedbackModal() {
    document.getElementById('feedbackOverlay').classList.remove('active');
    const modal = document.getElementById('feedbackModal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.getElementById('voiceStatus').textContent = '';
    if (recognition && recognizing) {
        recognition.stop();
    }
}

function setupFeedbackModal() {
    const feedbackBtn = document.getElementById('feedbackBtn');
    const overlay = document.getElementById('feedbackOverlay');
    const modal = document.getElementById('feedbackModal');
    const closeBtn = document.getElementById('feedbackCloseBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    const submitBtn = document.getElementById('submitFeedbackBtn');
    const textarea = document.getElementById('feedbackText');

    // Open modal
    feedbackBtn.addEventListener('click', openFeedbackModal);
    // Close modal
    overlay.addEventListener('click', closeFeedbackModal);
    closeBtn.addEventListener('click', closeFeedbackModal);
    // ESC key closes modal
    document.addEventListener('keydown', function(e) {
        if (modal.classList.contains('active') && e.key === 'Escape') {
            closeFeedbackModal();
        }
    });

    // Trap focus in modal
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            const focusable = modal.querySelectorAll('button, textarea');
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    // Voice-to-text using Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onstart = function() {
            recognizing = true;
            voiceBtn.setAttribute('aria-pressed', 'true');
            voiceBtn.textContent = '⏹️ Stop Voice';
            document.getElementById('voiceStatus').textContent = 'Listening...';
        };
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            textarea.value += (textarea.value ? ' ' : '') + transcript;
            document.getElementById('voiceStatus').textContent = 'Voice captured.';
        };
        recognition.onerror = function() {
            document.getElementById('voiceStatus').textContent = 'Voice recognition error.';
        };
        recognition.onend = function() {
            recognizing = false;
            voiceBtn.setAttribute('aria-pressed', 'false');
            voiceBtn.textContent = '🎤 Voice Input';
        };
        voiceBtn.addEventListener('click', function() {
            if (recognizing) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });
    } else {
        voiceBtn.disabled = true;
        document.getElementById('voiceStatus').textContent = 'Voice input not supported.';
    }

    // Submit feedback
    submitBtn.addEventListener('click', function() {
        const text = textarea.value.trim();
        // Placeholder: send feedback to backend
        // For Flask/Django: POST /api/feedback with text
        // fetch('/api/feedback', { method: 'POST', body: JSON.stringify({text}), headers: {'Content-Type': 'application/json'} })
        //   .then(...)
        alert('Feedback submitted!\nText: ' + text);
        closeFeedbackModal();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupFeedbackModal();
});
// --- Feedback Modal, Recording, and Submission Logic ---
let mediaRecorder = null;
let audioChunks = [];
let audioBlob = null;

function openFeedbackModal() {
    document.getElementById('feedbackOverlay').classList.add('active');
    const modal = document.getElementById('feedbackModal');
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.getElementById('feedbackText').focus();
}

function closeFeedbackModal() {
    document.getElementById('feedbackOverlay').classList.remove('active');
    const modal = document.getElementById('feedbackModal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    // Reset form
    document.getElementById('feedbackText').value = '';
    document.getElementById('recordingStatus').textContent = '';
    audioBlob = null;
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
}

function setupFeedbackModal() {
    const feedbackBtn = document.getElementById('feedbackBtn');
    const overlay = document.getElementById('feedbackOverlay');
    const modal = document.getElementById('feedbackModal');
    const closeBtn = document.getElementById('feedbackCloseBtn');
    const recordBtn = document.getElementById('recordBtn');
    const submitBtn = document.getElementById('submitFeedbackBtn');
    const textarea = document.getElementById('feedbackText');

    // Open modal
    feedbackBtn.addEventListener('click', openFeedbackModal);
    // Close modal
    overlay.addEventListener('click', closeFeedbackModal);
    closeBtn.addEventListener('click', closeFeedbackModal);
    // ESC key closes modal
    document.addEventListener('keydown', function(e) {
        if (modal.classList.contains('active') && e.key === 'Escape') {
            closeFeedbackModal();
        }
    });

    // Trap focus in modal
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            const focusable = modal.querySelectorAll('button, textarea');
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    // Voice recording
    recordBtn.addEventListener('click', async function() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            recordBtn.setAttribute('aria-pressed', 'false');
            recordBtn.textContent = '🎤 Record Voice';
            document.getElementById('recordingStatus').textContent = 'Recording stopped.';
            return;
        }
        // Request mic permission and start recording
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioChunks = [];
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
            mediaRecorder.onstop = () => {
                audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                document.getElementById('recordingStatus').textContent = 'Voice recorded.';
            };
            mediaRecorder.start();
            recordBtn.setAttribute('aria-pressed', 'true');
            recordBtn.textContent = '⏹️ Stop Recording';
            document.getElementById('recordingStatus').textContent = 'Recording...';
        } catch (err) {
            document.getElementById('recordingStatus').textContent = 'Microphone access denied.';
        }
    });

    // Submit feedback
    submitBtn.addEventListener('click', function() {
        const text = textarea.value.trim();
        // Placeholder: send feedback to backend
        // For Flask/Django: POST /feedback with text and/or audio
        // Example:
        // const formData = new FormData();
        // formData.append('text', text);
        // if (audioBlob) formData.append('audio', audioBlob, 'feedback.webm');
        // fetch('/api/feedback', { method: 'POST', body: formData })
        //   .then(...)
        alert('Feedback submitted!\nText: ' + text + (audioBlob ? '\n[Voice attached]' : ''));
        closeFeedbackModal();
    });
}


// --- Magical Sparkle Effect ---
// Flask/Django can set sparkle count, color, or animation speed via template variables
function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    // Random size and position
    const size = Math.random() * 8 + 6;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.left = `${Math.random() * 100}vw`;
    sparkle.style.top = `${Math.random() * 100}vh`;
    sparkle.style.animationDuration = `${2.5 + Math.random() * 2}s`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 3000);
}

function sparkleLoop() {
    // Flask/Jinja: let backend set sparkle frequency
    createSparkle();
    setTimeout(sparkleLoop, 350 + Math.random() * 400);
}

document.addEventListener('DOMContentLoaded', function() {
    insertUserData();
    setupProfileDropdown();
    setupFeedbackModal && setupFeedbackModal();
    // Start sparkles
    sparkleLoop();
});


// script.js - Handles dynamic username insertion and profile dropdown for LearnAble

// In production, these variables should be set by backend (Flask/Jinja/Django):
// window.userName = '{{ username }}';
// window.profilePicUrl = '{{ profile_pic_url }}';
// window.totalPoints = {{ total_points }};
// window.badge = '{{ badge }}';
// Or fetch from an API endpoint: fetch('/api/userinfo').then(...)
window.userName = window.userName || "USER"; // Placeholder for now
window.profilePicUrl = window.profilePicUrl || "https://randomuser.me/api/portraits/lego/1.jpg";
window.totalPoints = window.totalPoints || 120;
window.badge = window.badge || "Gold";

function insertUserData() {
    // Username
    const usernameSpan = document.getElementById('username');
    if (usernameSpan && window.userName) {
        usernameSpan.textContent = window.userName;
    }
    // Profile picture
    const profilePic = document.getElementById('profilePic');
    if (profilePic && window.profilePicUrl) {
        profilePic.src = window.profilePicUrl;
    }
    // Points and badge
    const pointsSpan = document.getElementById('points');
    if (pointsSpan && window.totalPoints !== undefined) {
        pointsSpan.textContent = window.totalPoints;
    }
    const badgeSpan = document.getElementById('badge');
    if (badgeSpan && window.badge) {
        badgeSpan.textContent = window.badge;
    }
}

// Dropdown logic
function setupProfileDropdown() {
    const profileContainer = document.getElementById('profileContainer');
    const dropdownMenu = document.getElementById('dropdownMenu');
    if (!profileContainer || !dropdownMenu) return;

    // Toggle dropdown on profile click
    profileContainer.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (dropdownMenu.classList.contains('active')) {
            dropdownMenu.classList.remove('active');
        }
    });

    // Prevent dropdown from closing when clicking inside
    dropdownMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Future: Sign out button can call backend logout route
    // document.getElementById('signOutBtn').addEventListener('click', function(e) {
    //     e.preventDefault();
    //     // window.location.href = '/logout';
    // });
}

document.addEventListener('DOMContentLoaded', function() {
    insertUserData();
    setupProfileDropdown();
});

// Future: Add click handlers for dashboard cards to navigate or call backend routes
// document.querySelectorAll('.dashboard-card').forEach(card => {
//     card.addEventListener('click', function(e) {
//         // Example: window.location.href = '/visual-impairment';
//         // Or call a backend API, etc.
//     });
// });
