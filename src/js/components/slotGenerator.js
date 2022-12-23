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
    const res = await fetch('./src/js/itemsrc.json');
    if (res.ok) {
      callback(await res.json());
    } else {
      alert('통신에러!');
    }
  }
  perfumeGene(data) {
    const docFrag = document.createDocumentFragment();
    data.forEach((v) => {
      const item = document.createElement('li');
      const itemTemplate = `
       <button type="button" class="btn-item" data-item="${v.name}" data-count="${v.count}"
            data-price="${v.cost}" data-img="${v.img}" data-desc="${v.desc}" data-ingredient="${v.ingredient}" data-forwho='${v.forwho}'>
            <img src="./src/img/${v.img}" alt="" class="img-item">
            <strong class="tit-item">${v.name}</strong>
            <span class="txt-price">₩${v.cost.toLocaleString()}</span>
        </button>`;
      item.innerHTML = itemTemplate;
      docFrag.appendChild(item);
    });
    this.itemList.appendChild(docFrag);
  }
}

export default SlotGenerator;
