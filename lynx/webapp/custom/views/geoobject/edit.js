define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'async',
  'models/geoobject',
  'collections/geoobjectTypes',
  'text!custom/templates/geoobject/edit.html'
], function ($, _, Backbone, Events, Async, Geoobject, GeoobjectTypes, contentTemplate) {
	var ContentView = Backbone.View.extend({
		el : '.content',
		template : contentTemplate,
		geoobject : null,
		map : null,
		placemark : null,
		placemarkChecked : false,
		events : {
			'click .goobjectSaveButton' : 'save',
			'click #placemarkCheckBtn' : 'checkPlacemark',
			'click #placemarkUncheckBtn' : 'uncheckPlacemark',
		},
		render : function ( src, callback ) {
			var view = this;
			Async.parallel({
				geoobject : function ( finish ) {
					if ( src.id != -1 ) {
						var geoobject = new Geoobject({ id: src.id });
						geoobject.fetch({
							success : function ( result ) {
								finish( null, result );
								
							}, 
							error : function ( err ) {
								finish( err );
							}
						});
					} else {
						finish( null, new Geoobject());
					}
				},
				geoobjectTypes : function ( finish ) {
					var geoobjectTypes = new GeoobjectTypes();
					geoobjectTypes.fetch({
						success : function ( result ) {
							finish( null, result );
						},
						error : function() {
							finish( err );
						}
					});
				}
			}, function ( err, results ) {

				if ( err ) throw err;

				view.geoobject = results.geoobject;
				var geoobjectVar = view.geoobject.toJSON();
				if ( geoobjectVar.latitude && geoobjectVar.longitude ) {
					view.placemarkChecked = true;
				}
				var geoobjectTypesVar = results.geoobjectTypes.toJSON();

				$(view.el).html(_.template(contentTemplate, 
					{ 
						geoobject : geoobjectVar, 
						placemarkChecked : view.placemarkChecked,
						geoobjectTypes : geoobjectTypesVar
					}));
				view.renderMap();

			});
		},

		save : function() {
			var view = this;
			view.geoobject.save({				
				label : $('#geoobjectLabel').val(),
				mark : $('#geoobjectMark').val(),
				address : $('#geoobjectAddres').val(),
				type : $('#geoobjectType').val(),
				latitude : view.geoobject.latitude,
				longitude : view.geoobject.longitude
			}, {
				success : function( geoobject ) {
					window.location.hash = '/view/geoobject.list';
				}
			});
		},

		renderMap : function( callback ) {
			var view = this;
			ymaps.ready( function() {

				view.map = new ymaps.Map("geoobjectMap", {
					center: [55.76, 37.64], 
					zoom: 14
				});

				var geoobjectVar = view.geoobject.toJSON();
				if ( geoobjectVar.latitude && geoobjectVar.longitude ) {
					view.placemark = new ymaps.Placemark( [geoobjectVar.latitude, geoobjectVar.longitude], {}, {preset : 'islands#darkGreenDotIcon'} );
					view.map.geoObjects.add( view.placemark );
					view.map.setCenter( [geoobjectVar.latitude, geoobjectVar.longitude] );
				}

				view.map.events.add('click', function(e) {
					var coords = e.get('coords');
					var pointGeometry = new ymaps.geometry.Point(coords);
					if ( !view.placemark && view.placemarkChecked ) {
						view.placemark = new ymaps.Placemark( pointGeometry, {}, {preset : 'islands#darkGreenDotIcon'} );
						view.map.geoObjects.add( view.placemark );
						view.geoobject.latitude = coords[0];
						view.geoobject.longitude = coords[1];
					}
				});

				if ( callback ) callback();
			});
		},

		checkPlacemark : function() {
			var view = this;
			$('#placemarkCheckBtn').addClass('hidden');
			$('#placemarkUncheckBtn').removeClass('hidden');
			view.placemarkChecked = true;
		},

		uncheckPlacemark : function() {
			var view = this;
			$('#placemarkUncheckBtn').addClass('hidden');
			$('#placemarkCheckBtn').removeClass('hidden');
			view.placemarkChecked = false;
			if ( view.map ) {
				view.map.geoObjects.remove( view.placemark );
				view.placemark = null;
			}
		}
	});
	return ContentView;
});