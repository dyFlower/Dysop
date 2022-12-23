class Dysop {
  constructor() {
    const machine = document.querySelector('.vending-machine');
    this.balance = machine.querySelector('.txt-balance');
    this.itemList = machine.querySelector('.ls-item');
    this.inputCostEl = machine.querySelector('.input-money');
    this.btnPut = machine.querySelector('.btn-put');
    this.btnReturn = machine.querySelector('.btn-return');
    this.btnGet = machine.querySelector('.btn-get');
    this.stagedList = machine.querySelector('.ls-item-staged');

    const contGet = document.querySelector('.cont-get');
    this.myMoney = contGet.querySelector('.txt-mymoney');
    this.gotList = contGet.querySelector('.ls-item-staged');
    this.txtTotal = contGet.querySelector('.txt-total');

    this.body = document.querySelector('body');
  }
  setup() {
    this.bindEvents();
  }

  // 선택한 향수 목록 생성
  stagedItemGenerator(target) {
    const stagedItem = document.createElement('li');
    stagedItem.dataset.item = target.dataset.item;
    stagedItem.dataset.price = target.dataset.price;
    stagedItem.innerHTML = `
        <button type="button" class="btn-stage">
            <img src="./src/img/${target.dataset.img}" alt="" class="img-item">
            <strong class="txt-item">${target.dataset.item}</strong>
            <span class="num-counter">1</span>
        </button>
        `;
    this.stagedList.appendChild(stagedItem);
  }
  // 선택한 향수 모달 생성
  modalGenerator(target) {
    const modal = document.createElement('article');
    modal.classList.add('modal-info');
    modal.innerHTML = `
    <div class="modal-blur"></div>
    <h2 class="name-perf">${target.dataset.item}</h2>
    <img src="./src/img/${target.dataset.img}" alt="">
    <p class="modal-desc">${target.dataset.desc}</p>
    <p class="modal-ingredient">주요 성분 | ${target.dataset.ingredient}</p>
    <p class="modal-forWho">대상 | ${target.dataset.forwho}</p>
        `;
    this.body.appendChild(modal);
  }

  bindEvents() {
    // 입금 버튼 기능
    this.btnPut.addEventListener('click', () => {
      const inputCost = parseInt(this.inputCostEl.value);
      const myMoneyVal = parseInt(this.myMoney.textContent.replaceAll(',', ''));
      const balanceVal = parseInt(this.balance.textContent.replaceAll(',', ''));

      if (inputCost) {
        if (inputCost <= myMoneyVal && inputCost > 0) {
          this.myMoney.textContent = new Intl.NumberFormat().format(myMoneyVal - inputCost) + ' 원';
          this.balance.textContent = new Intl.NumberFormat().format((balanceVal ? balanceVal : 0) + inputCost) + ' 원';
        } else {
          alert('소지금이 부족합니다.');
        }
        this.inputCostEl.value = null;
      }
    });

    // 거스름돈 반환 버튼
    this.btnReturn.addEventListener('click', () => {
      const balanceVal = parseInt(this.balance.textContent.replaceAll(',', ''));
      const myMoneyVal = parseInt(this.myMoney.textContent.replaceAll(',', ''));

      if (balanceVal) {
        this.myMoney.textContent = new Intl.NumberFormat().format(balanceVal + myMoneyVal) + ' 원';
        this.balance.textContent = '원';
      }
    });

    //자판기 메뉴 기능
    const btnsCola = this.itemList.querySelectorAll('button');

    btnsCola.forEach((item) => {
      item.addEventListener('click', (event) => {
        const targetEl = event.currentTarget;
        const balanceVal = parseInt(this.balance.textContent.replaceAll(',', ''));
        let isStaged = false;
        const targetElPrice = parseInt(targetEl.dataset.price);
        const stagedListItem = this.stagedList.querySelectorAll('li');

        if (balanceVal >= targetElPrice) {
          this.balance.textContent = new Intl.NumberFormat().format(balanceVal - targetElPrice) + ' 원';

          for (const item of stagedListItem) {
            if (item.dataset.item === targetEl.dataset.item) {
              item.querySelector('.num-counter').textContent++;
              isStaged = true;
              break;
            }
          }

          if (!isStaged) {
            this.stagedItemGenerator(targetEl);
          }

          targetEl.dataset.count--;

          if (parseInt(targetEl.dataset.count) === 0) {
            targetEl.parentElement.classList.add('sold-out');
            const warning = document.createElement('em');
            warning.textContent = '해당상품은 품절입니다.';
            warning.classList.add('ir');
            targetEl.parentElement.insertBefore(warning, targetEl);
          }
        } else {
          alert('잔액이 부족합니다. 돈을 입금해주세요');
        }
      });
      // 모달 등장 및 제거
      item.addEventListener('mouseover', (event) => {
        const targetEl = event.currentTarget;
        this.modalGenerator(targetEl);
      });

      item.addEventListener('mouseout', () => {
        const onModal = document.querySelector('.modal-info');
        onModal.remove();
      });
    });

    // 획득 버튼 기능
    this.btnGet.addEventListener('click', () => {
      let totalPrice = 0;
      for (const itemStaged of this.stagedList.querySelectorAll('li')) {
        let isGot = false;
        for (const itemGot of this.gotList.querySelectorAll('li')) {
          let itemGotCount = itemGot.querySelector('.num-counter');
          if (itemStaged.dataset.item === itemGot.dataset.item) {
            itemGotCount.textContent = parseInt(itemGotCount.textContent) + parseInt(itemStaged.querySelector('.num-counter').textContent);
            isGot = true;
            break;
          }
        }
        if (!isGot) {
          this.gotList.appendChild(itemStaged);
        }
      }

      this.stagedList.innerHTML = null;

      this.gotList.querySelectorAll('li').forEach((itemGot) => {
        totalPrice += itemGot.dataset.price * parseInt(itemGot.querySelector('.num-counter').textContent);
      });
      this.txtTotal.textContent = `총금액 : ${new Intl.NumberFormat().format(totalPrice)}원`;
    });
  }
}
export default Dysop;
