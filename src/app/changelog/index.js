'use strict';

const angular = require('angular');
const _ = require('lodash');

angular
.module('dbt')
.controller('ChangelogCtrl', ['$scope', '$state', 'project',
    function($scope, $state, projectService) {
        $scope.changelog_md = '(loading)'
        
        projectService.ready(function (project) {
            let project_name = $state.params.project_name
                ? $state.params.project_name
                : null;
            
            // default;
            var selected_changelog = project.docs["dbt.__changelog__"];
            var changelogs = _.filter(project.docs, {name: '__changelog__'});
            _.each(changelogs, function (changelog) {
                if (changelog.package_name != 'dbt') {
                    selected_changelog = changelog;
                }
            });
            // Select project-level changelogs
            if (project_name !== null) {
                selected_changelog = project.docs[`${project_name}.__${project_name}__`] || selected_changelog
                let changelogs = _.filter(project.docs, { name: `__${project_name}__` })
                _.each(changelogs, (changelog) => {
                    if (changelog.package_name !== project_name) {
                        selected_changelog = changelog
                    }
                })
            }
            $scope.changelog_md = selected_changelog.block_contents;
        });
}]);
