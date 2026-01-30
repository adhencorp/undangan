// Firebase
firebase.initializeApp({
  apiKey:"API_KEY",
  authDomain:"PROJECT.firebaseapp.com",
  databaseURL:"https://PROJECT.firebaseio.com",
  projectId:"PROJECT"
});

// OPENING
document.addEventListener('DOMContentLoaded',()=>{
  const openingBox=document.getElementById('openingBox');
  setTimeout(()=>openingBox.classList.add('show'),200);

  // Teks Home langsung muncul
  slideUpTeks('homeH2','Selamat Datang');
  slideUpTeks('homeP',`Kami mengundang ${nama} untuk hadir dan memberikan doa restu.`);

  galleryImages=Array.from(document.querySelectorAll('#galeri img'));
  galleryImages.forEach((img,i)=>{img.addEventListener('click',()=>openGallery(i));});
});

// OPENING BUTTON
function bukaUndangan(){
  document.getElementById('opening').style.display='none';
  const music=document.getElementById('bgMusic'); music.volume=0.5; music.play().catch(()=>{});
}

// NAMA TAMU
const q=new URLSearchParams(location.search);
const nama=q.get('to')||'Tamu Undangan';
document.getElementById('namaTamuOpen').textContent=nama;
document.getElementById('namaTamu').textContent=nama;
const inputNama=document.getElementById('namaHadir');
if(inputNama){inputNama.value=nama; inputNama.readOnly=true;}

// TAB
const imgKiri=document.getElementById('imgKiri');
const imgKanan=document.getElementById('imgKanan');
const galeriGrid=document.getElementById('galeriGrid');
let currentIndex=0,startX=0;
const popupImg=document.getElementById('popupImg');
const galleryPopup=document.getElementById('galleryPopup');

function openTab(id,btn){
  document.querySelectorAll('.tab-content').forEach(s=>{s.classList.remove('active','show');});
  document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('active'));
  const tab=document.getElementById(id);
  tab.classList.add('active');
  setTimeout(()=>tab.classList.add('show'),50);
  btn.classList.add('active');

  // slide header images
  imgKiri.style.transform='translateX(-200%)'; imgKanan.style.transform='translateX(200%)';
  setTimeout(()=>{imgKiri.style.transform='translateX(0)'; imgKanan.style.transform='translateX(0)';},100);

  if(id==='home') {
    slideUpTeks('homeH2','Selamat Datang');
    slideUpTeks('homeP',`Kami mengundang ${nama} untuk hadir dan memberikan doa restu.`);
  }
  if(id==='acara') {
    slideUpTeks('acaraH2','Waktu & Tempat');
    slideUpTeks('acaraCard','📅 Minggu, 20 April 2026\n🕙 Pukul 10.00 WIB\n📍 Masjid Agung Kota');
  }
  if(id==='galeri') galeriGrid.classList.add('show'); else galeriGrid.classList.remove('show');
  if(id==='bukutamu'){const bf=document.getElementById('bukuForm');bf.style.transform='scale(1)';bf.style.opacity='1';} else {const bf=document.getElementById('bukuForm');bf.style.transform='scale(0.7)';bf.style.opacity='0';}
  if(id==='lokasi'){const lf=document.getElementById('iframeLokasi');lf.style.transform='scale(1)';lf.style.opacity='1';} else {const lf=document.getElementById('iframeLokasi');lf.style.transform='scale(0.7)';lf.style.opacity='0';}
}

// COUNTDOWN WIB
const target=new Date(Date.UTC(2026,3,20,3,0,0)).getTime();
const d=document.getElementById('d'),h=document.getElementById('h'),m=document.getElementById('m'),s=document.getElementById('s');
setInterval(()=>{
  const diff=target-Date.now();
  if(diff<=0){d.textContent=h.textContent=m.textContent=s.textContent='0';return;}
  let newD=Math.floor(diff/86400000),
      newH=Math.floor(diff/3600000)%24,
      newM=Math.floor(diff/60000)%60,
      newS=Math.floor(diff/1000)%60;
  d.textContent=newD; h.textContent=newH; m.textContent=newM; s.textContent=newS;
},1000);

// BUKU TAMU
function kirimHadir(){
  if(!inputNama.value.trim()) return alert('Nama kosong');
  firebase.database().ref('kehadiran').push({
    nama:inputNama.value,
    status:document.getElementById('statusHadir').value,
    pesan:document.getElementById('ucapan').value,
    time:Date.now()
  });
  document.getElementById('ucapan').value='';
}
firebase.database().ref('kehadiran').limitToLast(50).on('child_added',snap=>{
  const d=snap.val();
  const list=document.getElementById('listHadir');
  list.innerHTML=`<p><b>${d.nama}</b> (${d.status})<br>${d.pesan||''}</p>`+list.innerHTML;
});

// SLIDE UP TEXT
function slideUpTeks(id,text){
  const el=document.getElementById(id);
  el.textContent=text;
  el.classList.remove('show');
  setTimeout(()=>el.classList.add('show'),50);
}

// GALERI POPUP FULL 9:16 HIDUP
let galleryImages;
function openGallery(i){
  currentIndex=i;
  popupImg.src=galleryImages[currentIndex].src;
  galleryPopup.style.display='flex';
  setTimeout(()=>galleryPopup.classList.add('show'),50);
}
function closeGallery(){
  galleryPopup.classList.remove('show');
  setTimeout(()=>galleryPopup.style.display='none',500);
}
function nextImage(){currentIndex=(currentIndex+1)%galleryImages.length;popupImg.src=galleryImages[currentIndex].src;}
function prevImage(){currentIndex=(currentIndex-1+galleryImages.length)%galleryImages.length;popupImg.src=galleryImages[currentIndex].src;}

// Swipe popup
popupImg.addEventListener('touchstart',e=>startX=e.touches[0].clientX);
popupImg.addEventListener('touchend',e=>{
  const endX=e.changedTouches[0].clientX;
  if(startX-endX>50) nextImage(); 
  if(endX-startX>50) prevImage();
});
popupImg.addEventListener('click',e=>{
  const x=e.offsetX,w=popupImg.clientWidth;
  if(x>w/2) nextImage(); else prevImage();
});