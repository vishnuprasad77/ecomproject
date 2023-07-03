def custom_context(request):
    user = request.user
    if request.user.is_authenticated:
        # Access the email attribute only if the user is authenticated
        user_email = request.user.email
    else:
        user_email = None
    return {
        'user_name': user.username,'user_email': user_email
    }