$(document).ready(function() {
    // var loadedEntries = [];
    $('#viewProtectedEntryModal').on('show.bs.modal', function (event) {
        var modal = $(this);
        var button = $(event.relatedTarget);
        var entryData = $(button).parent().parent();
        var entryId = entryData.data('entryid');
        // var alreadyLoadedEntry = _.find(loadedEntries, {_id:entryId});
        // if (alreadyLoadedEntry != undefined){
        //     event.stopPropagation();
        //     $('#entryModal').modal('show');
        //     $('.entryContent').text(alreadyLoadedEntry.content);
        // } else {
        modal.find('.hiddenEntryIdGetProtected').val(entryId);
        // }
    });
    $('#entryModal').on('show.bs.modal', function (event) {
        if (event.relatedTarget){
            var modal = $(this);
            var button = $(event.relatedTarget);
            var entryData = $(button).parent().parent();
            var entryId = entryData.data('entryid');
            // var alreadyLoadedEntry = _.find(loadedEntries, {_id:entryId});
            // if (alreadyLoadedEntry != undefined){
            //     event.stopPropagation();
            //     $('#entryModal').modal('show');
            //     $('.entryContent').text(alreadyLoadedEntry.content);
            // } else {
            $.get('/my-writing/entry/'+entryId)
            .done(data => {
                $('.entryTitle').text(data.title);
                $('.entryContent').text(data.content);
                $('.entryMood').text("Mood: " + data.mood);
            });
        }
    });
    $('#deleteEntryModal').on('show.bs.modal', function (event) {
        var modal = $(this);
        var button = $(event.relatedTarget);
        var entryData = $(button).parent().parent();
        var entryId = entryData.data('entryid');
        modal.find('.hiddenEntryIdDelete').val(entryId);
    });
    $('#protectedEntryModalView').on('hidden.bs.modal', function (event) {
        $('form.viewProtectedEntryForm').find(".protectedEntryPasswordDelete").val("");
        $('.incorrectPasswordMessageView').css('visibility','hidden');
    });
    $('#deleteProtectedEntryModal').on('show.bs.modal', function (event) {
        var modal = $(this);
        var button = $(event.relatedTarget);
        var entryData = $(button).parent().parent();
        var entryId = entryData.data('entryid');
        modal.find('.hiddenProtectedEntryIdDelete').val(entryId);
    });
    $('.protectedEntrySubmitView').click(function(){
        $.post('/my-writing/protected-entry', $('form.viewProtectedEntryForm').serialize())
        .done(data => {
            $('form.viewProtectedEntryForm').find(".protectedEntryPasswordView").val("");
            $('.incorrectPasswordMessageView').css('visibility','hidden');
            $('#viewProtectedEntryModal').modal('hide');
            $('#entryModal').modal('show');
            $('.entryTitle').text(data.title);
            $('.entryContent').text(data.content);
            $('.entryMood').text(data.mood);
            // loadedEntries.push(data);
        })
        .fail(data => {
            $('.incorrectPasswordMessageView').css('visibility','visible');
        });
    });
    $('.deleteEntrySubmit').click(function(){
        deletedEntryId = $('form.deleteEntryForm input.hiddenEntryIdDelete').val();
        $.post('/my-writing/delete', $('form.deleteEntryForm').serialize())
        .done(data => {
            if (data == 'success'){
                $('tr[data-entryid=' + deletedEntryId + ']').remove();
                $('#deleteEntryModal').modal('hide');
                $('#deletedEntryAlert').css('display', 'block');
            }
        })
        .fail(data => {

        });
    });
    $('.deleteProtectedEntrySubmit').click(function(){
        deletedEntryId = $('form.deleteProtectedEntryForm input.hiddenProtectedEntryIdDelete').val();
        $.post('/my-writing/delete-protected', $('form.deleteProtectedEntryForm').serialize())
        .done(data => {
            if (data == 'success'){
                $('form.deleteProtectedEntryForm').find(".protectedEntryPasswordDelete").val("");
                $('tr[data-entryid=' + deletedEntryId + ']').remove();
                $('#deleteProtectedEntryModal').modal('hide');
                $('#deletedEntryAlert').css('display', 'block');
                $('.incorrectPasswordMessageDelete').css('visibility','hidden');
            }
        })
        .fail(data => {
            $('.incorrectPasswordMessageDelete').css('visibility','visible');            
        });
    });

});