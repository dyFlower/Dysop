class SlotGenerator {
  constructor() {
    this.itemList = document.querySelector('.ls-item');
  }
  async setup() {
    await this.loadData((json) => {
      this.perfumeGene(json);
    });
  }
  async loadData(callback) {
    const res = await fetch('src/js/itemsrc.json');
    if (res.ok) {
      callback(await res.json());
    } else {
      alert('통신에러!');
    }
  }
  perfumeGene(data) {
    const docFrag = document.createDocumentFragment();
    data.forEach((el) => {
      const item = document.createElement('li');
      const itemTemplate = `
       <button type="button" class="btn-item" data-item="${el.name}" data-count="${el.count}"
            data-price="${el.cost}" data-img="${el.img}">
            <img src="./src/img/${el.img}" alt="" class="img-item">
            <strong class="tit-item">${el.name}</strong>
            <span class="txt-price">W${el.cost.toLocaleString()}</span>
        </button>`;
      item.innerHTML = itemTemplate;
      docFrag.appendChild(item);
    });
    this.itemList.appendChild(docFrag);
  }
}

export default SlotGenerator;
