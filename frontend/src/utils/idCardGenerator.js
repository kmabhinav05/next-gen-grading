// Utility to dynamically draw high-resolution front and back ID card textures for the 3D Lanyard

export const generateIdCardTextures = (user, role = 'STUDENT') => {
  const width = 1024;
  const height = 1440;

  // Colors per role
  const roleThemes = {
    ADMIN: {
      primary: '#0f172a',
      accent: '#f59e0b',
      accentLight: '#fef3c7',
      label: 'SYSTEM ADMINISTRATOR',
      stripe: '#d97706',
      badgeBg: '#78350f',
      codePrefix: 'ADM'
    },
    STAFF: {
      primary: '#1e1b4b',
      accent: '#6366f1',
      accentLight: '#e0e7ff',
      label: 'FACULTY MEMBER',
      stripe: '#4f46e5',
      badgeBg: '#312e81',
      codePrefix: 'FAC'
    },
    STUDENT: {
      primary: '#092338',
      accent: '#06b6d4',
      accentLight: '#cffafe',
      label: 'UNDERGRADUATE STUDENT',
      stripe: '#0891b2',
      badgeBg: '#164e63',
      codePrefix: 'STU'
    },
    PARENT: {
      primary: '#1c1917',
      accent: '#10b981',
      accentLight: '#d1fae5',
      label: 'REGISTERED GUARDIAN',
      stripe: '#059669',
      badgeBg: '#064e3b',
      codePrefix: 'PAR'
    }
  };

  const theme = roleThemes[role] || roleThemes.STUDENT;
  const fullName = (user?.full_name || user?.username || 'Academic Member').toUpperCase();
  const idNumber =
    user?.student?.reg_no ||
    user?.reg_no ||
    `${theme.codePrefix}-${String(user?.id || 101).padStart(4, '0')}`;
  const department =
    user?.staff?.department ||
    user?.student?.department ||
    (role === 'ADMIN' ? 'Office of the Dean & COE' : role === 'PARENT' ? 'Guardian Council' : 'Computer Science & Engineering');
  const session = '2025 - 2026';

  // --- 1. FRONT CARD CANVAS ---
  const frontCanvas = document.createElement('canvas');
  frontCanvas.width = width;
  frontCanvas.height = height;
  const fCtx = frontCanvas.getContext('2d');

  if (fCtx) {
    // Base Background Gradient
    const bgGrad = fCtx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(0.4, '#f8fafc');
    bgGrad.addColorStop(1, '#f1f5f9');
    fCtx.fillStyle = bgGrad;
    fCtx.fillRect(0, 0, width, height);

    // Subtle security guilloche pattern overlay
    fCtx.save();
    fCtx.strokeStyle = 'rgba(203, 213, 225, 0.4)';
    fCtx.lineWidth = 1;
    for (let i = -width; i < width * 2; i += 32) {
      fCtx.beginPath();
      fCtx.moveTo(i, 0);
      fCtx.bezierCurveTo(i + 200, height * 0.3, i - 100, height * 0.7, i + 300, height);
      fCtx.stroke();
    }
    fCtx.restore();

    // Top Header Banner
    const bannerGrad = fCtx.createLinearGradient(0, 0, width, 0);
    bannerGrad.addColorStop(0, theme.primary);
    bannerGrad.addColorStop(0.7, '#1e293b');
    bannerGrad.addColorStop(1, theme.accent);
    fCtx.fillStyle = bannerGrad;
    fCtx.fillRect(0, 0, width, 320);

    // Accent Line
    fCtx.fillStyle = theme.accent;
    fCtx.fillRect(0, 314, width, 8);

    // Holographic Security Strip on Banner
    fCtx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    fCtx.fillRect(0, 260, width, 40);

    // Logo / Crest Placeholder
    fCtx.save();
    fCtx.fillStyle = '#ffffff';
    fCtx.beginPath();
    fCtx.arc(140, 150, 60, 0, Math.PI * 2);
    fCtx.fill();
    fCtx.strokeStyle = theme.accent;
    fCtx.lineWidth = 6;
    fCtx.stroke();

    fCtx.fillStyle = theme.primary;
    fCtx.font = 'bold 44px sans-serif';
    fCtx.textAlign = 'center';
    fCtx.textBaseline = 'middle';
    fCtx.fillText('NG', 140, 150);
    fCtx.restore();

    // Institution Name
    fCtx.fillStyle = '#ffffff';
    fCtx.font = '900 48px sans-serif';
    fCtx.textAlign = 'left';
    fCtx.fillText('NEXT GEN ACADEMY', 230, 135);

    fCtx.fillStyle = theme.accentLight;
    fCtx.font = '600 24px sans-serif';
    fCtx.letterSpacing = '3px';
    fCtx.fillText('COE ACCREDITED INSTITUTION • OFFICIAL PASS', 230, 180);

    // Avatar Box / Portrait Frame
    const avatarX = width / 2;
    const avatarY = 520;
    const avatarRadius = 130;

    fCtx.save();
    fCtx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    fCtx.shadowBlur = 24;
    fCtx.shadowOffsetY = 12;

    // Outer Ring
    fCtx.beginPath();
    fCtx.arc(avatarX, avatarY, avatarRadius + 8, 0, Math.PI * 2);
    fCtx.fillStyle = theme.accent;
    fCtx.fill();

    // Inner Avatar Fill
    const avGrad = fCtx.createLinearGradient(avatarX - avatarRadius, avatarY - avatarRadius, avatarX + avatarRadius, avatarY + avatarRadius);
    avGrad.addColorStop(0, theme.primary);
    avGrad.addColorStop(1, '#334155');
    fCtx.beginPath();
    fCtx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
    fCtx.fillStyle = avGrad;
    fCtx.fill();

    // Monogram Initial
    fCtx.fillStyle = '#ffffff';
    fCtx.font = 'bold 110px sans-serif';
    fCtx.textAlign = 'center';
    fCtx.textBaseline = 'middle';
    fCtx.fillText(fullName[0] || 'U', avatarX, avatarY);
    fCtx.restore();

    // Role Badge Pill Under Avatar
    const pillWidth = 480;
    const pillHeight = 52;
    const pillX = (width - pillWidth) / 2;
    const pillY = 690;

    fCtx.fillStyle = theme.primary;
    fCtx.beginPath();
    fCtx.roundRect(pillX, pillY, pillWidth, pillHeight, 26);
    fCtx.fill();

    fCtx.strokeStyle = theme.accent;
    fCtx.lineWidth = 3;
    fCtx.stroke();

    fCtx.fillStyle = '#ffffff';
    fCtx.font = 'bold 24px sans-serif';
    fCtx.textAlign = 'center';
    fCtx.textBaseline = 'middle';
    fCtx.fillText(`★  ${theme.label}  ★`, width / 2, pillY + pillHeight / 2);

    // User Full Name
    fCtx.fillStyle = '#0f172a';
    fCtx.font = '900 52px sans-serif';
    fCtx.textAlign = 'center';
    fCtx.fillText(fullName, width / 2, 800);

    // Information Grid Table
    const tableY = 860;
    const drawRow = (label, value, y) => {
      fCtx.fillStyle = '#64748b';
      fCtx.font = '600 24px sans-serif';
      fCtx.textAlign = 'left';
      fCtx.fillText(label.toUpperCase(), 120, y);

      fCtx.fillStyle = '#0f172a';
      fCtx.font = 'bold 28px sans-serif';
      fCtx.textAlign = 'right';
      fCtx.fillText(value, width - 120, y);

      fCtx.strokeStyle = '#e2e8f0';
      fCtx.lineWidth = 2;
      fCtx.beginPath();
      fCtx.moveTo(120, y + 20);
      fCtx.lineTo(width - 120, y + 20);
      fCtx.stroke();
    };

    drawRow('Identity No', idNumber, tableY);
    drawRow('Department', department.length > 28 ? department.slice(0, 26) + '...' : department, tableY + 68);
    drawRow('Valid Session', session, tableY + 136);
    drawRow('Status', 'VERIFIED & ACTIVE', tableY + 204);

    // Bottom Barcode & Chip Area
    const bottomY = 1170;

    // Gold Smart Chip Graphic
    fCtx.fillStyle = '#d97706';
    fCtx.beginPath();
    fCtx.roundRect(120, bottomY, 110, 80, 12);
    fCtx.fill();
    fCtx.strokeStyle = '#fef3c7';
    fCtx.lineWidth = 3;
    fCtx.stroke();

    // Chip lines
    fCtx.strokeStyle = '#b45309';
    fCtx.lineWidth = 2;
    fCtx.strokeRect(145, bottomY + 15, 60, 50);

    // Simulated Barcode
    fCtx.fillStyle = '#0f172a';
    let curX = 280;
    const barWidths = [4, 8, 3, 10, 4, 12, 6, 4, 8, 3, 12, 5, 8, 3, 10, 4, 6, 8, 3, 12, 4, 8, 6, 3, 10, 4, 12, 3, 8];
    for (const w of barWidths) {
      if (curX + w > width - 120) break;
      fCtx.fillRect(curX, bottomY, w, 68);
      curX += w + 6;
    }

    fCtx.font = '500 20px monospace';
    fCtx.textAlign = 'center';
    fCtx.fillStyle = '#64748b';
    fCtx.fillText(`* ${idNumber} *`, width / 2 + 60, bottomY + 95);

    // Footer notice
    fCtx.font = '600 20px sans-serif';
    fCtx.fillStyle = '#94a3b8';
    fCtx.textAlign = 'center';
    fCtx.fillText('CONTROLLER OF EXAMINATIONS • DIGITAL CAMPUS BADGE', width / 2, 1370);
  }

  // --- 2. BACK CARD CANVAS ---
  const backCanvas = document.createElement('canvas');
  backCanvas.width = width;
  backCanvas.height = height;
  const bCtx = backCanvas.getContext('2d');

  if (bCtx) {
    // Back Background
    bCtx.fillStyle = '#ffffff';
    bCtx.fillRect(0, 0, width, height);

    // Black Magnetic Stripe
    bCtx.fillStyle = '#1e293b';
    bCtx.fillRect(0, 80, width, 180);

    // Signature Panel
    bCtx.fillStyle = '#f8fafc';
    bCtx.fillRect(80, 320, width - 160, 130);
    bCtx.strokeStyle = '#cbd5e1';
    bCtx.lineWidth = 2;
    bCtx.strokeRect(80, 320, width - 160, 130);

    // Security watermark lines in signature box
    bCtx.strokeStyle = '#e2e8f0';
    bCtx.lineWidth = 1;
    for (let y = 345; y < 440; y += 18) {
      bCtx.beginPath();
      bCtx.moveTo(90, y);
      bCtx.lineTo(width - 90, y);
      bCtx.stroke();
    }

    bCtx.font = 'italic 34px cursive, sans-serif';
    bCtx.fillStyle = '#1e3a8a';
    bCtx.textAlign = 'left';
    bCtx.fillText(fullName, 120, 395);

    bCtx.font = '600 18px sans-serif';
    bCtx.fillStyle = '#94a3b8';
    bCtx.textAlign = 'right';
    bCtx.fillText('AUTHORIZED SIGNATURE / NOT VALID WITHOUT SIGNATURE', width - 100, 475);

    // Terms & Conditions Block
    bCtx.fillStyle = '#0f172a';
    bCtx.font = 'bold 30px sans-serif';
    bCtx.textAlign = 'left';
    bCtx.fillText('TERMS OF DIGITAL CREDENTIALS', 80, 560);

    const terms = [
      '1. This credential card remains the property of Next Gen Grading Academy.',
      '2. Must be presented upon request during examinations, campus entry, or laboratory sessions.',
      '3. Loss or damage must be reported immediately to the COE Administration.',
      '4. Unauthorized duplication or transfer is strictly prohibited and subject to institutional discipline.',
      '5. In case of emergency or finding this card, please contact: security@college.edu | +91 98765 43210'
    ];

    bCtx.font = '500 24px sans-serif';
    bCtx.fillStyle = '#475569';
    let termY = 620;
    for (const t of terms) {
      bCtx.fillText(t, 80, termY);
      termY += 56;
    }

    // QR Code Simulation Grid
    const qrSize = 220;
    const qrX = width / 2 - qrSize / 2;
    const qrY = 960;

    bCtx.fillStyle = '#ffffff';
    bCtx.fillRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32);
    bCtx.strokeStyle = '#cbd5e1';
    bCtx.lineWidth = 3;
    bCtx.strokeRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32);

    bCtx.fillStyle = '#0f172a';
    // QR position markers
    const drawQRMarker = (x, y) => {
      bCtx.fillRect(x, y, 60, 60);
      bCtx.fillStyle = '#ffffff';
      bCtx.fillRect(x + 10, y + 10, 40, 40);
      bCtx.fillStyle = '#0f172a';
      bCtx.fillRect(x + 20, y + 20, 20, 20);
    };
    drawQRMarker(qrX, qrY);
    drawQRMarker(qrX + qrSize - 60, qrY);
    drawQRMarker(qrX, qrY + qrSize - 60);

    // Scatter mock QR blocks
    for (let r = 0; r < 14; r++) {
      for (let c = 0; c < 14; c++) {
        if ((r < 5 && c < 5) || (r < 5 && c > 8) || (r > 8 && c < 5)) continue;
        if ((r * 7 + c * 13) % 3 === 0) {
          bCtx.fillRect(qrX + 65 + c * 7, qrY + 65 + r * 7, 6, 6);
        }
      }
    }

    bCtx.font = '600 22px monospace';
    bCtx.textAlign = 'center';
    bCtx.fillStyle = '#64748b';
    bCtx.fillText('SCAN TO VERIFY CREDENTIAL', width / 2, qrY + qrSize + 48);

    // Official Stamp
    bCtx.save();
    bCtx.translate(width - 200, 1100);
    bCtx.rotate(-0.15);
    bCtx.strokeStyle = '#dc2626';
    bCtx.lineWidth = 4;
    bCtx.strokeRect(-120, -50, 240, 100);
    bCtx.fillStyle = '#dc2626';
    bCtx.font = 'bold 24px sans-serif';
    bCtx.textAlign = 'center';
    bCtx.fillText('COE CERTIFIED', 0, -10);
    bCtx.font = '600 18px sans-serif';
    bCtx.fillText('OFFICIAL SEAL', 0, 20);
    bCtx.restore();

    bCtx.font = '500 20px sans-serif';
    bCtx.fillStyle = '#94a3b8';
    bCtx.textAlign = 'center';
    bCtx.fillText('Next Gen Grading Systems • Institutional Verification Active', width / 2, 1370);
  }

  // --- 3. STRAP CANVAS ---
  const strapCanvas = document.createElement('canvas');
  strapCanvas.width = 192;
  strapCanvas.height = 384;
  const sCtx = strapCanvas.getContext('2d');

  if (sCtx) {
    sCtx.fillStyle = theme.primary;
    sCtx.fillRect(0, 0, 192, 384);

    // Strap edge borders
    sCtx.fillStyle = theme.accent;
    sCtx.fillRect(0, 0, 8, 384);
    sCtx.fillRect(184, 0, 8, 384);

    // Strap text repeated
    sCtx.save();
    sCtx.translate(96, 192);
    sCtx.rotate(-Math.PI / 2);
    sCtx.fillStyle = '#ffffff';
    sCtx.font = 'bold 22px sans-serif';
    sCtx.textAlign = 'center';
    sCtx.textBaseline = 'middle';
    sCtx.fillText('NEXT GEN GRADING ★ ID', 0, 0);
    sCtx.restore();
  }

  return {
    frontImage: frontCanvas.toDataURL('image/png'),
    backImage: backCanvas.toDataURL('image/png'),
    strapImage: strapCanvas.toDataURL('image/png'),
    strapColor: theme.primary,
    accentColor: theme.accent
  };
};
