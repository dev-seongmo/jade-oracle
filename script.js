const UTC_OFFSETS = {
  US: -5,
  GB: 0,
  FR: 1,
  IN: 5.5,
  TH: 7,
  JP: 9,
  AU: 10,
  BR: -3,
};

const KST_OFFSET = 9;

const form = document.getElementById('kst-form');
const countryInput = document.getElementById('country');
const birthInput = document.getElementById('birth-datetime');
const result = document.getElementById('result');

function formatKoreanDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const country = countryInput.value;
  const localDateTime = birthInput.value;

  if (!country || !localDateTime) {
    result.textContent = '국가와 출생 시간을 모두 입력해 주세요.';
    return;
  }

  const localOffset = UTC_OFFSETS[country];
  const [datePart, timePart] = localDateTime.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);

  const utcMillis = Date.UTC(year, month - 1, day, hours, minutes) - (localOffset * 60 * 60 * 1000);
  const kstMillis = utcMillis + (KST_OFFSET * 60 * 60 * 1000);
  const kstDate = new Date(kstMillis);

  const diffHours = KST_OFFSET - localOffset;
  const diffText = diffHours >= 0 ? `+${diffHours}` : `${diffHours}`;

  result.textContent = `변환 완료: 한국시간은 ${formatKoreanDate(kstDate)} (KST, UTC+9) 입니다. (시차 ${diffText}시간 적용)`;
});
