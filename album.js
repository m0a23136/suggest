const gallery = document.getElementById("gallery");
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener('input', (e) => {
    renderPhotos(e.target.value);
});

// 写真表示
function renderPhotos(filterTag = '') {
  const photos = getPhotos();
  gallery.innerHTML = '';

  const filtered = photos.filter(photo => {
    if (!filterTag) return true;

    return photo.tags.some(tag =>
      tag.toLowerCase().includes(filterTag.toLowerCase())
    );
  });

  filtered.reverse().forEach(photo => {
    const card = document.createElement('div');
    card.className = 'photo-card';

    console.log(photo);

   card.innerHTML = `
     <img src="${photo.image}" alt="photo">
     
     <div class="photo-info">

      <div class="memo">
       ${photo.memo||''}
      </div>

     <div class="tags">
      ${photo.tags.map(tag => `#${tag}`).join(' ')}
     </div>

     <div class="date">
      ${photo.date}
     </div>

     <button class="delete-btn" data-id="${photo.id}">
      削除
     </button>
     </div>
    `;

    gallery.appendChild(card);
  });

  document.querySelectorAll('.delete-btn').forEach(button => {

   button.addEventListener('click', () => {
     const id = Number(button.dataset.id);
     const photos = getPhotos();
     const updatedPhotos = photos.filter(
      photo => photo.id !== id  
     );

     savePhotos(updatedPhotos);

     renderPhotos(searchInput.value);
     //console.log("押された");
     console.log(button.dataset.id);
   });

  });
}