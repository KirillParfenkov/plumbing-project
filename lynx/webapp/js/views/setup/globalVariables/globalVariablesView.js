define([
    'jquery',
    'underscore',
    'backbone',
    'async',
    'underi18n',
    'messager',
    'collections/globalVariables',
    'models/globalVariable',
    'text!templates/setup/globalVariables/globalVariablesView.html',
    'text!templates/setup/globalVariables/row.html',
    'text!templates/error.html',
    'less!templates/setup/globalVariables/globalVariablesView.less'
], function ($, _, Backbone, async, underi18n, Messager, GlobalVariables, GlobalVariable,
             template, rowTemplate, errorTemplate ) {
    var GlobalVariablesView = Backbone.View.extend({
        messager : new Messager( $('.page .main-message-box') ),
        events : {
            'click .global-variable-list .variables .action .edit' : 'edit',
            'click .global-variable-list .variables .action .save' : 'save',
            'click .global-variable-list .variables .action .delete ' : 'delete',
            'click .global-variable-list .variables .action .cancel ' : 'cancel',
            'click .global-variable-list  .action .add ' : 'add'
        },

        globalVariables : null,

        render : function ( src, callback ) {
            var view = this;

            view.globalVariables = new GlobalVariables();
            view.globalVariables.fetch({
                success : function( variables ) {
                $(view.el).html(_.template( underi18n.template( template, view.i18n ), { variables : variables.toJSON() }));
            },
            error : function( err ) {
                view.messager.danger('Резурс не доступен =(');
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
                variable = view.globalVariables.get( id );
            } else {
                variable = new GlobalVariable();
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
                        view.globalVariables.add( variableVar );
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
                variable = view.globalVariables.get( id ),
                messager = new Messager( $('.global-variable-list .mesage-box') );

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
            var path = '/templates/setup/globalVariables/';
            var view = this;
            $.get( path + i18n + '.json', function( data ) {
                view.i18n = underi18n.MessageFactory( data );
                done( null, view.i18n );
            }).fail( function( err ) {
                done( err );
            });
        },
    });
    return GlobalVariablesView;
});