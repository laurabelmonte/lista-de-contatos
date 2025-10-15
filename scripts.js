document.addEventListener("DOMContentLoaded", () => {
  
  const createBtn = document.getElementById("create-btn");
  const modalOverlay = document.getElementById("modal-overlay");
  const contactForm = document.getElementById("contact-form");
  const cancelBtn = document.getElementById("cancel-btn");
  const contactList = document.querySelector(".contact-list");
  const filterInput = document.getElementById("filter-input");
  const modalTitle = document.getElementById("modal-title");
  const contactIdInput = document.getElementById("contact-id");

  const getContacts = () => JSON.parse(localStorage.getItem("contacts")) || [];

  const saveContacts = (contacts) => localStorage.setItem("contacts", JSON.stringify(contacts));

  // Função para renderizar os contatos na tela
  const renderContacts = (contactsToRender) => {
    const allContacts = contactsToRender || getContacts();
    contactList.innerHTML = ""; 

    allContacts.forEach((contact) => {
      const contactItem = document.createElement("div");
      contactItem.classList.add("contact-item");
      contactItem.innerHTML = `
        <div class="contact-info">
          <p><strong>${contact.nome}</strong></p>
          <p>Telefone: ${contact.telefone}</p>
          <p>Email: ${contact.email}</p>
        </div>
        <div class="contact-actions">
          <button class="edit-btn" data-id="${contact.id}">EDITAR</button>
          <button class="remove-btn" data-id="${contact.id}">REMOVER</button>
        </div>
      `;
      contactList.appendChild(contactItem);
    });
  };

  const openModal = (title = "Novo Contato", contact = {}) => {
    modalTitle.innerText = title;
    contactIdInput.value = contact.id || "";
    contactForm.nome.value = contact.nome || "";
    contactForm.telefone.value = contact.telefone || "";
    contactForm.email.value = contact.email || "";
    modalOverlay.classList.remove("hidden");
  };

  const closeModal = () => {
    modalOverlay.classList.add("hidden");
    contactForm.reset();
    contactIdInput.value = "";
  };

  // Abre o modal para criar um novo contato
  createBtn.addEventListener("click", () => openModal());

  // Fecha o modal ao clicar em Cancelar ou no fundo
  cancelBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Salva um contato 
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = contactIdInput.value;
    const newContact = {
      nome: contactForm.nome.value,
      telefone: contactForm.telefone.value,
      email: contactForm.email.value,
    };
    
    let contacts = getContacts();

    if (id) {
      // Editando um contato existente
      contacts = contacts.map((contact) =>
        contact.id == id ? { ...newContact, id: parseInt(id) } : contact
      );
    } else {
      // Criando um novo contato
      newContact.id = Date.now(); 
      contacts.push(newContact);
    }

    saveContacts(contacts);
    renderContacts();
    closeModal();
  });

  // Lógica para os botões de Editar e Remover
  contactList.addEventListener("click", (e) => {
    const contacts = getContacts();
    const id = e.target.dataset.id;

    if (e.target.classList.contains("remove-btn")) {
      if (confirm("Tem certeza que deseja remover este contato?")) {
        const updatedContacts = contacts.filter((contact) => contact.id != id);
        saveContacts(updatedContacts);
        renderContacts();
      }
    }

    if (e.target.classList.contains("edit-btn")) {
      const contactToEdit = contacts.find((contact) => contact.id == id);
      openModal("Editar Contato", contactToEdit);
    }
  });

  // Filtra os contatos em tempo real
  filterInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const contacts = getContacts();
    const filteredContacts = contacts.filter((contact) =>
      contact.nome.toLowerCase().includes(searchTerm)
    );
    renderContacts(filteredContacts);
  });

  renderContacts();
});