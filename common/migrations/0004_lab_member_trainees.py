# Generated by Django 2.0.4 on 2018-10-26 16:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0003_lab_member_position'),
    ]

    operations = [
        migrations.AddField(
            model_name='lab_member',
            name='trainees',
            field=models.BooleanField(default=False, verbose_name='Other Trainees'),
            preserve_default=False,
        ),
    ]
