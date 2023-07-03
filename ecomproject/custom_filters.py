from django import template

register = template.Library()
@register.filter
def floatmul(value, arg):
    try:
        return float(value) * float(arg)
    except (ValueError, TypeError):
        return value