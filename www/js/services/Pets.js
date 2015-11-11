var app = angular.module('upet.services.pets', []);

app.service("PetService", function ($q, AuthService) {
	var self = {
		'page': 0,
		'page_size': 20,
		'isLoading': false,
		'isSaving': false,
		'hasMore': true,
		'results': [],
		'refresh': function () {
			self.page = 0;
			self.isLoading = false;
			self.isSaving = false;
			self.hasMore = true;
			self.results = [];
			return self.load();
		},
		'next': function () {
			self.page += 1;
			return self.load();
		},
		'load': function () {
			self.isLoading = true;
			var d = $q.defer();

			// Initialise Query
			var Pet = Parse.Object.extend("Pet");
			var petQuery = new Parse.Query(Pet);
			petQuery.descending('created');
			petQuery.equalTo("owner", AuthService.user);

			// Paginate
			petQuery.skip(self.page * self.page_size);
			petQuery.limit(self.page_size);

			// Perform the query
			petQuery.find({
				success: function (results) {
					angular.forEach(results, function (item) {
						var Pet = new Pet(item);
						self.results.push(Pet)
					});
					console.debug(self.results);

					// Are we at the end of the list?
					if (results.length == 0) {
						self.hasMore = false;
					}

					// Finished
					d.resolve();
				}
			});

			return d.promise;
		},
		'track': function (data) {
			self.isSaving = true;
			var d = $q.defer();

			var Pet = Parse.Object.extend("Pet");
			var user = AuthService.user;
			var file = data.picture ? new Parse.File("photo.jpg", {base64: data.picture}) : null;

			var Pet = new Pet();
			Pet.set("owner", user);
			Pet.set("picture", file);
			Pet.set("idm", data.idm);
			Pet.set("name", data.name);
			Pet.set("species", data.species);
			Pet.set("breed", data.breed);
			Pet.set("gender", data.gender);
			Pet.set("birthdate", data.birthdate);
			

			Pet.save(null, {
				success: function (Pet) {
					console.log("Pet tracked");
					self.results.unshift(Pet);
					d.resolve(Pet);
				},
				error: function (item, error) {
					
					d.reject(error);
				}
			});

			return d.promise;
		}

	};

	return self;
});