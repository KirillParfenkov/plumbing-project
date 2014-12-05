define([
    'module',
    'jquery',
    'underscore',
    'backbone',
    'async',
    'underi18n',
    'messager',
    'collections/variables',
    'models/variable',
    'text!./template/variables-list.html',
    'text!./template/row.html',
    'text!templates/error.html',
    'less!./css/variables-list.less'
], function ( module, $, _, Backbone, async, underi18n, Messager, Variables, Variable, template, rowTemplate, errorTemplate ) {

    var VariablesView = Backbone.View.extend({

        el : '.content',
        messager : new Messager( $('.page .main-message-box') ),
        events : {
            'click .variable-list .variables .action .edit' : 'edit',
            'click .variable-list .variables .action .save' : 'save',
            'click .variable-list .variables .action .delete ' : 'delete',
            'click .variable-list .variables .action .cancel ' : 'cancel',
            'click .variable-list  .action .add ' : 'add'
        },

        variables : null,

        render : function ( src, callback ) {
            console.log('redner variables view!');
            var view = this;

            view.variables = new Variables();
            view.variables.fetch({
                success : function( variables ) {
                    $(view.el).html(_.template( underi18n.template( template, view.i18n ), { variables : variables.toJSON() }));
                },
                error : function( err ) {
                    view.messager.danger('Реcурс не доступен =(');
                }
          });
        },

        hasPermission : function( systemPermissionSet ) {
            if ( systemPermissionSet && systemPermissionSet.allowEditСonfiguration ) {
                if ( systemPermissionSet.allowEditСonfiguration.indexOf('read') == -1 ) {
                  return false;
                }
            } else {
                return false;
            }
            return true;
        },

        edit : function( event ) {

            var row = $(event.currentTarget).parents('tr'),
                viewVar = row.find('.view-value'),
                editVar = row.find('.edit-value'),
                saveLink = row.find('.action .save'),
                cancelLink = row.find('.action .cancel'),
                deleteLink = row.find('.action .delete'),
                editLink = row.find('.action .edit');

            viewVar.hide();
            deleteLink.hide();
            editLink.hide();
            editVar.show();
            saveLink.show();
            cancelLink.show();
        },

        save : function( event ) {

            var view = this;

            var row = $(event.currentTarget).parents('tr'),
                viewVar = row.find('.view-value'),
                editVar = row.find('.edit-value'),
                viewName = row.find('.view-name'),
                editName = row.find('.edit-name'),
                viewId = row.find('.view-id'),
                id = $(event.currentTarget).attr('value'),
                variable = null,
                saveData = {};

            if ( id ) {
                variable = view.variables.get( id );
            } else {
                variable = new Variable();
                saveData['name'] = editName.val();
            }
            saveData['value'] = editVar.val();

            variable.save(saveData,
            {
                success : function( variableVar ) {
                    viewVar.html( variableVar.get('value') );
                    viewName.html( variableVar.get('name') );
                    viewId.html( variableVar.get('_id') );
                    view.finishEdit( event );

                    if ( !id ) {
                        view.Variables.add( variableVar );
                        view.setItemId( row, variableVar._id );
                    }
                },
                error : function( err ) {
                    console.log( err );
                }
            });

        },

        setItemId : function( $row, id ) {
            $row.find('.delete').attr('value', id);
            $row.find('.save').attr('value', id);
            $row.find('.cancel').attr('value', id);
            $row.find('.edit').attr('value', id);
        },

        delete : function( event ) {

            var view = this,
                $link = $(event.currentTarget),
                id = $link.attr('value'),
                variable = view.variables.get( id ),
                messager = new Messager( $('.variable-list .mesage-box') );

            if (confirm(_.template(underi18n.template('<%_ deleteConfirm %>', view.i18n), {name : variable.get('name') }))) {
                variable.destroy({
                    success : function(model, response) {
                        messager.success( underi18n.template('<%_ successDeleteMessage %>', view.i18n) );
                        $link.parents('tr').remove();
                    },
                    error : function( err ) {
                        messager.danger(  underi18n.template('<%_ errorDeleteMessage %>', view.i18n) );
                    }
                });
            }
        },

        cancel : function( event ) {
            var id = $(event.currentTarget).attr('value');
            if ( id ) {
                this.finishEdit( event );
            } else {
                var row =  $(event.currentTarget).parents('tr');
                row.remove();
            }
        },

        add : function() {
            var view = this;
            var $table = $('table.variables');
            var row = view.createRow( true );
            $table.append( row );
        },

        finishEdit : function( event ) {
            var view = this,
                row = $(event.currentTarget).parents('tr'),
                viewVar = row.find('.view-value'),
                editVar = row.find('.edit-value'),
                viewName = row.find('.view-name'),
                editName = row.find('.edit-name'),
                saveLink = row.find('.action .save'),
                cancelLink = row.find('.action .cancel'),
                deleteLink = row.find('.action .delete'),
                editLink = row.find('.action .edit');

            viewVar.show();
            deleteLink.show();
            editLink.show();
            viewName.show();
            editVar.hide();
            editName.hide();
            saveLink.hide();
            cancelLink.hide();
        },

        createRow: function( isEditState ) {
            $row = $(_.template( rowTemplate, { variable : {}} ));
            if ( isEditState ) {
                $row.find('.view-value').hide();
                $row.find('.edit-value').show();
                $row.find('.view-name').hide();
                $row.find('.edit-name').show();
                $row.find('.action .save').show();
                $row.find('.action .cancel').show();
                $row.find('.action .delete').hide();
                $row.find('.action .edit').hide();
            }
            return $row;
        },

        loadI18n : function ( i18n, done ) {
            var path = module.id + '/../i18n/';
            var view = this;
            $.get( path + i18n + '.json', function( data ) {
                view.i18n = underi18n.MessageFactory( data );
                done( null, view.i18n );
            }).fail( function( err ) {
                done( err );
            });
        },
    });
    return VariablesView;
});