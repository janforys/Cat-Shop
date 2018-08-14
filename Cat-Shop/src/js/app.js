App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },

  /// Instantiating web3
  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  /// Instantiating the contract
  initContract: function() {
    $.getJSON('Adoption.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
    var AdoptionArtifact = data;
    App.contracts.Adoption = TruffleContract(AdoptionArtifact);

    // Set the provider for our contract
    App.contracts.Adoption.setProvider(App.web3Provider);

    // Use our contract to retrieve and mark the adopted pets
    return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  /// Getting the adopted cats and updating the UI
  markAdopted: function(adopters, account) {
    // Declare the variable "adoptionInstance"
    var adoptionInstance;

    // Access the deployed Adoption contract
    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;

      // Using call() allows us to read data from the blockchain
      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      // After calling getAdopters(), we then loop through all of them
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-cat').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
  // Any errors are logged to the console
  }).catch(function(err) {
    console.log(err.message);
  });
},

  /// Handling the adopt() Function
  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      // Select the first account
      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance) {
        // Store the instance in adoptionInstance
        adoptionInstance = instance;

        // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(catID, {from: account});
    // If no err, proceed to call our markAdopted() function to sync the UI with our newly stored data
    }).then(function(result) {
      return App.markAdopted();
    }).catch(function(err) {
      console.log(err.message);
  });
  });
}

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
